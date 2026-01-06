import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { Country, getCountries, getStates } from '@/constants/locations'
import { useThemeColor } from '@/hooks/use-theme-color'
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

  // Theme colors
  const cardColor = useThemeColor({}, 'card')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const tintColor = useThemeColor({}, 'tint')

  const genderOptions = ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER']
  const orientationOptions = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Other']
  const religionOptions = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Atheist', 'Agnostic', 'Other', 'Prefer not to say']
  const countries = getCountries()

  const [name, setName] = useState(draft.displayName || '')
  const [age, setAge] = useState(draft.age?.toString() || '')
  const [bio, setBio] = useState(draft.bio || '')
  const [gender, setGender] = useState(draft.gender || 'MALE')
  const [orientation, setOrientation] = useState(draft.orientation || 'Straight')
  const [heightCm, setHeightCm] = useState(draft.heightCm?.toString() || '')
  const [hobbies, setHobbies] = useState(draft.hobbies?.join(', ') || '')
  const [country, setCountry] = useState<Country | ''>((draft.country as Country) || '')
  const [state, setState] = useState(draft.state || '')
  const [city, setCity] = useState(draft.city || '')
  const [profession, setProfession] = useState(draft.profession || '')
  const [religion, setReligion] = useState(draft.religion || '')

  const availableStates = country ? getStates(country) : []

  const handleContinue = async () => {
    if (!name || !age || !bio || !gender || !orientation || !country || !state || !city) {
      Alert.alert('Missing Information', 'Please fill in all required fields to continue.')
      return
    }

    const updatedData = {
      name,
      age: parseInt(age, 10),
      bio,
      gender,
      orientation,
      heightCm: heightCm ? parseInt(heightCm, 10) : undefined,
      hobbies: hobbies ? hobbies.split(',').map((h: string) => h.trim()).filter(Boolean) : [],
      country,
      state,
      city,
      profession: profession || undefined,
      religion: religion || undefined,
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
              placeholderTextColor={textColor + '50'}
              style={{ backgroundColor: cardColor, padding: 12, borderRadius: 8, color: textColor, borderWidth: 1, borderColor }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Age</AppText>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="25"
              placeholderTextColor={textColor + '50'}
              keyboardType="number-pad"
              style={{ backgroundColor: cardColor, padding: 12, borderRadius: 8, color: textColor, borderWidth: 1, borderColor }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Bio</AppText>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about your interests..."
              placeholderTextColor={textColor + '50'}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: cardColor, padding: 12, borderRadius: 8, color: textColor, borderWidth: 1, borderColor }}
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
                    backgroundColor: gender === option ? tintColor : cardColor,
                    borderWidth: 1,
                    borderColor: gender === option ? tintColor : borderColor,
                  }}
                >
                  <AppText style={{ color: gender === option ? '#fff' : textColor }}>{option.replace('_', ' ')}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Orientation</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {orientationOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setOrientation(option)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: orientation === option ? tintColor : cardColor,
                    borderWidth: 1,
                    borderColor: orientation === option ? tintColor : borderColor,
                  }}
                >
                  <AppText style={{ color: orientation === option ? '#fff' : textColor }}>{option}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Height (cm)</AppText>
            <TextInput
              value={heightCm}
              onChangeText={setHeightCm}
              placeholder="170"
              placeholderTextColor={textColor + '50'}
              keyboardType="number-pad"
              style={{ backgroundColor: cardColor, padding: 12, borderRadius: 8, color: textColor, borderWidth: 1, borderColor }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Country *</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {countries.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    setCountry(c)
                    setState('')
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: country === c ? tintColor : cardColor,
                    borderWidth: 1,
                    borderColor: country === c ? tintColor : borderColor,
                  }}
                >
                  <AppText style={{ color: country === c ? '#fff' : textColor }}>{c}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {country && (
            <View style={{ gap: 8 }}>
              <AppText>State/Region *</AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {availableStates.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setState(s)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      backgroundColor: state === s ? tintColor : cardColor,
                      borderWidth: 1,
                      borderColor: state === s ? tintColor : borderColor,
                    }}
                  >
                    <AppText style={{ color: state === s ? '#fff' : textColor }}>{s}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={{ gap: 8 }}>
            <AppText>City *</AppText>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Your city"
              placeholderTextColor={textColor + '50'}
              style={{ backgroundColor: cardColor, padding: 12, borderRadius: 8, color: textColor, borderWidth: 1, borderColor }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Profession</AppText>
            <TextInput
              value={profession}
              onChangeText={setProfession}
              placeholder="Software Engineer"
              placeholderTextColor={textColor + '50'}
              style={{ backgroundColor: cardColor, padding: 12, borderRadius: 8, color: textColor, borderWidth: 1, borderColor }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Religion</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {religionOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setReligion(option)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: religion === option ? tintColor : cardColor,
                    borderWidth: 1,
                    borderColor: religion === option ? tintColor : borderColor,
                  }}
                >
                  <AppText style={{ color: religion === option ? '#fff' : textColor }}>{option}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AppText>Hobbies</AppText>
            <TextInput
              value={hobbies}
              onChangeText={setHobbies}
              placeholder="Reading, Gaming, Hiking (comma separated)"
              placeholderTextColor={textColor + '50'}
              multiline
              style={{ backgroundColor: cardColor, padding: 12, borderRadius: 8, color: textColor, borderWidth: 1, borderColor }}
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
