import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { Button } from '@react-navigation/elements'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const router = useRouter()
  const { updateDraft, draft } = useUserDraft()
  
  const [name, setName] = useState(draft.displayName || '')
  const [age, setAge] = useState(draft.age?.toString() || '')
  const [bio, setBio] = useState(draft.bio || '')
  // Default values
  const [gender, setGender] = useState(draft.gender || 'Male') 
  const [orientation, setOrientation] = useState(draft.orientation || 'Straight') 

  const handleContinue = () => {
    if (!name || !age || !bio || !gender || !orientation) {
        // Validation could be better
        return
    }
    
    updateDraft({
        displayName: name,
        age: parseInt(age, 10),
        bio,
        gender,
        orientation
    })
    
    router.push('/onboarding/preferences')
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
             <AppText>Gender: </AppText>
             <TextInput 
             value={gender} onChangeText={setGender}
             placeholder="Non Binary"
             style={{backgroundColor: 'white', padding: 12, borderRadius: 8}}
             />
          </View>

          <View style={{ gap: 8 }}>
             <AppText>Orientation: </AppText>
             <TextInput value={orientation} onChangeText={setOrientation}
             placeholder="Straight"
             style={{backgroundColor: 'white', padding: 12, borderRadius: 8}}/>
          </View>

          <Button variant="filled" onPress={handleContinue}>
            Continue
          </Button>
        </ScrollView>
      </SafeAreaView>
    </AppView>
  )
}
