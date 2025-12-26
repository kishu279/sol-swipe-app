import { AppConfig } from '@/constants/app-config'

export interface User {
  id: string
  walletPubKey: string
  isActive: boolean
  profile?: Profile | null
  preferences?: Preferences | null
}

export interface Profile {
  id: string
  userId: string
  displayName: string
  bio: string
  age: number
  gender: string
  orientation: string
}

export interface Preferences {
  id: string
  userId: string
  preferredGenders: string[]
  ageMin: number
  ageMax: number
  maxDistanceKm: number
}

export const api = {
  checkUser: async (walletPublicKey: string): Promise<User | null> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/users/${walletPublicKey}`)
      const data = await response.json()
      if (data.success) {
        return data.data
      }
      return null
    } catch (error) {
      console.error('Error checking user:', error)
      return null
    }
  },

  createUser: async (walletPublicKey: string): Promise<{ userId: string } | null> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletPublicKey }),
      })
      const data = await response.json()
      if (data.success) {
        return { userId: data.data.userId }
      }
      return null
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  },

  createProfile: async (profileData: Partial<Profile> & { userId: string }): Promise<boolean> => {
    try {
      // API expects 'name' instead of 'displayName' for creation
      const { displayName, ...rest } = profileData
      const payload = {
        ...rest,
        name: displayName,
      }

      const response = await fetch(`${AppConfig.apiUrl}/create-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Error creating profile:', error)
      return false
    }
  },

  setPreferences: async (userId: string, preferencesData: Partial<Preferences>): Promise<boolean> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/users/${userId}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencesData),
      })
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Error setting preferences:', error)
      return false
    }
  },
}
