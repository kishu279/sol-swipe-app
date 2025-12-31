import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { api } from '@/lib/api'
import { Button } from '@react-navigation/elements'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PreferencesScreen() {
  const router = useRouter()
  const { updateDraft, draft } = useUserDraft()
  const { publicKey } = useLocalSearchParams<{ publicKey: string }>()
  const [isLoading, setIsLoading] = useState(false)

  const [ageMin, setAgeMin] = useState(draft?.ageMin?.toString() || '18')
  const [ageMax, setAgeMax] = useState(draft?.ageMax?.toString() || '35')
  const [maxDistance, setMaxDistance] = useState(draft?.maxDistanceKm?.toString() || '50')

  const handleContinue = () => {
    if (!ageMin || !ageMax || !maxDistance) {
      Alert.alert('Missing Information', 'Please fill in all preference fields to continue.')
      return
    }

    const updatedData = {
      ageMin: parseInt(ageMin, 10),
      ageMax: parseInt(ageMax, 10),
      maxDistanceKm: parseInt(maxDistance, 10),
      preferredGenders: ['Female', 'Male'],
    }

    updateDraft(updatedData)
    console.log('Preferences updated:', updatedData)

    router.push('/onboarding/prompt')
  }

  const handleSubmit = async () => {
    if (!ageMin || !ageMax || !maxDistance) {
      Alert.alert('Missing Information', 'Please fill in all preference fields to continue.')
      return
    }

    setIsLoading(true)

    const preferencesData = {
      preferredGenders: ['MALE', 'FEMALE'],
      ageMin: parseInt(ageMin, 10),
      ageMax: parseInt(ageMax, 10),
      distanceRange: parseInt(maxDistance, 10),
    }

    console.log('[PREFERENCES] Form data:', preferencesData)
    console.log('[PREFERENCES] Public key:', publicKey)

    updateDraft({
      ageMin: preferencesData.ageMin,
      ageMax: preferencesData.ageMax,
      maxDistanceKm: preferencesData.distanceRange,
      preferredGenders: preferencesData.preferredGenders,
    })

    try {
      console.log('[PREFERENCES] Calling setPreferences API...')
      const success = await api.setPreferences(publicKey, preferencesData)
      console.log('[PREFERENCES] API result:', success)

      if (!success) {
        Alert.alert('Error', 'Failed to save preferences. Please try again.')
        return
      }

      Alert.alert('Success', 'Preferences saved successfully!')
      router.replace('/(tabs)/account')
    } catch (error) {
      console.error('[PREFERENCES] Error:', error)
      Alert.alert('Error', 'Failed to save preferences. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Real-time updates to context
  const updateAgeMin = (val: string) => {
    setAgeMin(val)
    if (val) updateDraft({ ageMin: parseInt(val, 10) })
  }
  const updateAgeMax = (val: string) => {
    setAgeMax(val)
    if (val) updateDraft({ ageMax: parseInt(val, 10) })
  }
  const updateDist = (val: string) => {
    setMaxDistance(val)
    if (val) updateDraft({ maxDistanceKm: parseInt(val, 10) })
  }

  return (
    <AppView style={{ flex: 1 }}>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
          <View>
            <AppText type="title">Preferences</AppText>
            <AppText>Who are you looking for?</AppText>
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Age Range</AppText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TextInput
                value={ageMin}
                onChangeText={updateAgeMin}
                placeholder="Min"
                keyboardType="number-pad"
                style={{ backgroundColor: 'white', padding: 12, borderRadius: 8, flex: 1 }}
              />
              <TextInput
                value={ageMax}
                onChangeText={updateAgeMax}
                placeholder="Max"
                keyboardType="number-pad"
                style={{ backgroundColor: 'white', padding: 12, borderRadius: 8, flex: 1 }}
              />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Max Distance (km)</AppText>
            <TextInput
              value={maxDistance}
              onChangeText={updateDist}
              placeholder="50"
              keyboardType="number-pad"
              style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}
            />
          </View>

          <Button variant="filled" onPress={handleSubmit} disabled={isLoading}>
            Continue
          </Button>
        </ScrollView>
      </SafeAreaView>
    </AppView>
  )
}
