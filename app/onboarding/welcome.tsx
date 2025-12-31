import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { Button } from '@react-navigation/elements'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function WelcomeScreen() {
  const router = useRouter()
  const { publicKey } = useLocalSearchParams<{ publicKey: string }>()
  const { updateDraft } = useUserDraft()

  useEffect(() => {
    if (publicKey) {
      updateDraft({ walletPublicKey: publicKey })
    }
  }, [publicKey])

  const handleContinue = () => {
    if (!publicKey) return
    router.push({ pathname: '/onboarding/profile', params: { publicKey } })
  }

  return (
    <AppView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        <View style={{ gap: 16 }}>
          <AppText type="title">Welcome!</AppText>
          <AppText>
            Let's get you set up. We'll start by creating your profile. We will create your account at the end of the
            process.
          </AppText>
        </View>

        <Button variant="filled" onPress={handleContinue}>
          Get Started
        </Button>
      </SafeAreaView>
    </AppView>
  )
}
