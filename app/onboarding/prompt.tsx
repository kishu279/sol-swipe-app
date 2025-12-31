import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { api, PromptQuestion } from '@/lib/api'
import { Button } from '@react-navigation/elements'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PromptQuestionsScreen() {
  const router = useRouter()
  const { updateDraft, submit } = useUserDraft()
  
  const [questions, setQuestions] = useState<PromptQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedQuestions = await api.getPromptQuestions()
      
      if (fetchedQuestions.length === 0) {
        setError('No questions available. You can skip this step.')
      }
      
      setQuestions(fetchedQuestions.sort((a, b) => a.order - b.order))
    } catch (err) {
      setError('Failed to load questions. Please try again.')
      console.error('Error loading questions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const isFormValid = () => {
    if (questions.length === 0) return true // Allow skipping if no questions
    return questions.every((q) => answers[q.id]?.trim().length > 0)
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    setIsSubmitting(true)

    try {
      // Prepare answers in the required format
      const promptAnswers = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || '',
      }))

      // Update draft with prompt answers
      updateDraft({ promptAnswers })

      // Submit the complete onboarding data
      const success = await submit()
      // const response = await api.submitPromptAnswers()
      
      if (success) {
        router.replace('/(tabs)/account')
      } else {
        setError('Failed to complete setup. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error submitting:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    setIsSubmitting(true)
    try {
      const success = await submit()
      if (success) {
        router.replace('/(tabs)/account')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <AppText style={{ marginTop: 16 }}>Loading questions...</AppText>
      </AppView>
    )
  }

  return (
    <AppView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
          <View>
            <AppText type="title">Prompt Questions</AppText>
            <AppText>
              {questions.length > 0
                ? 'Answer these questions to help others get to know you better.'
                : 'No questions available at the moment.'}
            </AppText>
          </View>

          {error && (
            <View style={{ backgroundColor: '#fee', padding: 12, borderRadius: 8 }}>
              <AppText style={{ color: '#c00' }}>{error}</AppText>
            </View>
          )}

          {questions.map((question, index) => (
            <View key={question.id} style={{ gap: 8 }}>
              <AppText style={{ fontWeight: '600' }}>
                {index + 1}. {question.question}
              </AppText>
              <TextInput
                value={answers[question.id] || ''}
                onChangeText={(text) => handleAnswerChange(question.id, text)}
                placeholder="Type your answer here..."
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: 'white',
                  padding: 12,
                  borderRadius: 8,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
              />
            </View>
          ))}

          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <View style={{ gap: 12 }}>
              <Button
                variant="filled"
                onPress={handleSubmit}
                disabled={!isFormValid() && questions.length > 0}
              >
                {questions.length > 0 ? 'Finish Setup' : 'Continue'}
              </Button>
              
              {questions.length > 0 && (
                <Button variant="tinted" onPress={handleSkip}>
                  Skip for now
                </Button>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppView>
  )
}