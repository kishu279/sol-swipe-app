import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { api } from '@/lib/api'
import { Button } from '@react-navigation/elements'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const router = useRouter()
  const { updateDraft, draft } = useUserDraft()
  const { publicKey } = useLocalSearchParams<{ publicKey: string }>()

  const genderOptions = ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER']

  const [name, setName] = useState(draft.displayName || '')
  const [age, setAge] = useState(draft.age?.toString() || '')
  const [bio, setBio] = useState(draft.bio || '')
  const [gender, setGender] = useState(draft.gender || 'MALE')
  const [orientation, setOrientation] = useState(draft.orientation || 'Straight')

  const handleContinue = async () => {
    if (!name || !age || !bio || !gender || !orientation) {
      Alert.alert('Missing Information', 'Please fill in all required fields to continue.')
      return
    }

    const updatedData = {
      name,
      age: parseInt(age, 10),
      bio,
      gender,
      orientation,
    }

    console.log('[PROFILE] Form data:', updatedData)
    console.log('[PROFILE] Public key:', publicKey)

    updateDraft(updatedData)

    // api call to create the profile
    console.log('[PROFILE] Calling createProfile API...')
    const { success, message } = await api.createProfile(publicKey, updatedData)
    console.log('[PROFILE] API result:', { success, message })

    // pop up small alert if failed
    if (!success) {
      Alert.alert('Error', message)
      
      // TODO: redo all this process 
      return
    }

    Alert.alert('Success', 'Profile created successfully!')
    router.push({ pathname: '/onboarding/preferences', params: { publicKey } })
  }

  return (
    <AppView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
          <View>
            <AppText type="title">Create Profile</AppText>
            <AppText>Tell us a bit about yourself.</AppText>
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Display Name</AppText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Age</AppText>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="25"
              keyboardType="number-pad"
              style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Bio</AppText>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about your interests..."
              multiline
              numberOfLines={4}
              style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Gender</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setGender(option)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: gender === option ? '#007AFF' : 'white',
                    borderWidth: 1,
                    borderColor: gender === option ? '#007AFF' : '#E5E5E5',
                  }}
                >
                  <AppText style={{ color: gender === option ? 'white' : 'black' }}>{option.replace('_', ' ')}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Orientation: </AppText>
            <TextInput
              value={orientation}
              onChangeText={setOrientation}
              placeholder="Straight"
              style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}
            />
          </View>

          <Button variant="filled" onPress={handleContinue}>
            Continue
          </Button>
        </ScrollView>
      </SafeAreaView>
    </AppView>
  )
}
