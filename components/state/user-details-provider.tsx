import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'

// TYPE OF DATA TO BE COLLECTED FOR USER PROFILE
export type UserDraft = {
  walletPublicKey?: string
  displayName?: string
  bio?: string
  age?: number
  gender?: string
  orientation?: string
  heightCm?: number
  hobbies?: string[]
  country?: string
  state?: string
  city?: string
  profession?: string
  religion?: string
  ageMin?: number
  ageMax?: number
  maxDistanceKm?: number
  preferredGenders?: string[]
  promptAnswers?: { questionId: string; answer: string }[]
}

// ... imports

// CONTEXT TYPE
export interface UserDraftContextType {
  draft: UserDraft
  user: UserDraft | null
  updateDraft: (data: Partial<UserDraft>) => void
  reset: () => void
  refreshUser: () => Promise<void>
}

// CREATE CONTEXT
export const UserDraftContext = createContext<UserDraftContextType | undefined>(undefined)

// hook
export function useUserDraft() {
  const context = useContext(UserDraftContext)
  if (!context) {
    throw new Error('useUserDraft must be used within a UserDraftProvider')
  }
  return context
}

export const USER_PROFILE_STORAGE_KEY = 'user_profile_data'

// PROVIDER COMPONENT
export function UserDraftProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [draft, setDraft] = useState<UserDraft>({})
  const [user, setUser] = useState<UserDraft | null>(null)

  useEffect(() => {
    refreshUser()
  }, [])

  const refreshUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load user profile', e)
    }
  }

  const updateDraft = (data: Partial<UserDraft>) => {
    setDraft((prev) => ({ ...prev, ...data }))
  }

  const reset = async () => {
    console.log('[UserDraftProvider] reset called')
    setDraft({})
    setUser(null)
    try {
      console.log('[UserDraftProvider] Removing item from AsyncStorage...')
      await AsyncStorage.removeItem(USER_PROFILE_STORAGE_KEY)
      console.log('[UserDraftProvider] Item removed.')

      // Double check
      const check = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY)
      console.log('[UserDraftProvider] Post-reset check:', check)
    } catch (e) {
      console.error('Failed to clear user storage', e)
    }
  }

  return (
    <UserDraftContext.Provider value={{ draft, user, updateDraft, reset, refreshUser }}>
      {children}
    </UserDraftContext.Provider>
  )
}
