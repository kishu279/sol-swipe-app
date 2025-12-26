import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useAuth } from '@/components/auth/auth-provider'
import { USER_PROFILE_STORAGE_KEY } from '@/components/state/user-details-provider'
import { AppConfig } from '@/constants/app-config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button } from '@react-navigation/elements'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignIn() {
  const { signIn, isLoading } = useAuth()
  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          {/* Dummy view to push the next view to the center. */}
          <View />
          <View style={{ alignItems: 'center', gap: 16 }}>
            <AppText type="title">{AppConfig.name}</AppText>
            <Image source={require('../assets/images/icon.png')} style={{ width: 128, height: 128 }} />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Button
              variant="filled"
              style={{ marginHorizontal: 16 }}
              onPress={async () => {
                const account = await signIn()
                
                // Check local storage for existing profile
                const storedProfile = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY)
                console.log('[SignIn] storedProfile found:', storedProfile)
                const user = storedProfile ? JSON.parse(storedProfile) : null
                
                // If user exists and has a public key (rudimentary check)
                if (user && user.walletPublicKey === account.publicKey.toString()) {
                  console.log('[SignIn] User matches, redirecting to account')
                  router.replace('/(tabs)/account')
                } else {
                  console.log('[SignIn] No matching user, redirecting to onboarding')
                  router.replace({
                    pathname: '/onboarding/welcome',
                    params: { publicKey: account.publicKey.toString() }
                  })
                }
              }}
            >
              Connect
            </Button>
            <Button
                variant="filled"
                style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: 'red' }}
                onPress={async () => {
                    await AsyncStorage.removeItem(USER_PROFILE_STORAGE_KEY)
                    alert('App state cleared! You can now Connect as a new user.')
                }}
            >
                Reset App State (Dev)
            </Button>
          </View>
        </SafeAreaView>
      )}
    </AppView>
  )
}
