import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useAuth } from '@/components/auth/auth-provider'
import { USER_PROFILE_STORAGE_KEY, useUserDraft } from '@/components/state/user-details-provider'
import { AppConfig } from '@/constants/app-config'
import { api } from '@/lib/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button } from '@react-navigation/elements'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignIn() {
  const { signIn, isLoading } = useAuth()
  const { reset, updateDraft } = useUserDraft()
  const [isChecking, setIsChecking] = React.useState(false)

  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      {isLoading || isChecking ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          {isChecking && <AppText style={{ marginTop: 16 }}>Checking account...</AppText>}
        </View>
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
              disabled={isLoading || isChecking}
              style={{ marginHorizontal: 16 }}
              onPress={async () => {
                setIsChecking(true)
                try {
                  console.log('[SIGNIN] Step 1: Connecting wallet...')
                  const account = await signIn()
                  const publicKey = account.publicKey.toString()
                  console.log('[SIGNIN] Step 2: Wallet connected -', publicKey)

                  // Check if user exists on backend
                  console.log('[SIGNIN] Step 3: Checking if user exists on backend...')
                  const existingUser = await api.checkUser(publicKey)
                  
                  if (existingUser) {
                    console.log('[SIGNIN] Step 4: User found in database')
                    console.log('[SIGNIN] - Has Profile:', !!existingUser.profile)
                    console.log('[SIGNIN] - Has Preferences:', !!existingUser.preferences)
                  } else {
                    console.log('[SIGNIN] Step 4: User NOT found in database')
                  }

                  // Decision tree
                  if (existingUser && existingUser.profile && existingUser.preferences) {
                    console.log('[DECISION] ✓ Profile exists + ✓ Preferences exist')
                    console.log('[DECISION] → Redirecting to Account screen')
                    
                    const userProfile = {
                      walletPublicKey: publicKey,
                      displayName: existingUser.profile.displayName,
                      bio: existingUser.profile.bio,
                      age: existingUser.profile.age,
                      gender: existingUser.profile.gender,
                      orientation: existingUser.profile.orientation,
                      ageMin: existingUser.preferences.ageMin,
                      ageMax: existingUser.preferences.ageMax,
                      maxDistanceKm: existingUser.preferences.maxDistanceKm,
                      preferredGenders: existingUser.preferences.preferredGenders,
                    }

                    await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile))
                    updateDraft(userProfile)
                    router.replace('/(tabs)/account')
                  } else if (existingUser && existingUser.profile && !existingUser.preferences) {
                    console.log('[DECISION] ✓ Profile exists + ✗ Preferences missing')
                    console.log('[DECISION] → Skipping profile creation, redirecting to Preferences screen')
                    
                    updateDraft({ walletPublicKey: publicKey })
                    router.replace({
                      pathname: '/onboarding/preferences',
                      params: { publicKey },
                    })
                  } else {
                    console.log('[DECISION] ✗ Profile missing (or user doesn\'t exist)')
                    console.log('[DECISION] → Redirecting to Onboarding (Welcome → Profile → Preferences)')
                    
                    if (!existingUser) {
                      console.log('[SIGNIN] Step 5: Creating new user in database...')
                      const createResponse = await api.createUser(publicKey)
                      console.log('[SIGNIN] Step 6: User creation', createResponse ? 'Success' : 'Failed')
                    }
                    
                    updateDraft({ walletPublicKey: publicKey })
                    reset()
                    router.replace({
                      pathname: '/onboarding/welcome',
                      params: { publicKey },
                    })
                  }
                } catch (error) {
                  console.error('[ERROR] Sign in failed:', error)
                } finally {
                  setIsChecking(false)
                }
              }}
            >
              Connect to wallet
            </Button>
            <Button
              disabled={isLoading || isChecking}
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
