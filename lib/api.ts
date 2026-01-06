import { AppConfig } from '@/constants/app-config'
import { makeSwipeForNextSuggestion } from './payment'

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
  heightCm?: number
  hobbies?: string[]
  country: string
  state: string
  city: string
  profession?: string
  religion?: string
}

export interface Preferences {
  id: string
  userId: string
  preferredGenders: string[]
  ageMin: number
  ageMax: number
  maxDistanceKm: number
}

export interface PromptQuestion {
  id: string
  question: string
  order: number
}

export interface PromptAnswer {
  promptId: string
  answer: string
}

export const api = {
  getPromptQuestions: async (publicKey: string): Promise<PromptQuestion[]> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/user/${publicKey}/prompts`)
      const data = await response.json()
      if (data.success) {
        return data.data
      }
      return []
    } catch (error) {
      console.error('Error fetching prompt questions:', error)
      return []
    }
  },

  submitPromptAnswers: async (publicKey: string, answers: PromptAnswer[]): Promise<boolean> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/user/${publicKey}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Error submitting prompt answers:', error)
      return false
    }
  },

  checkUser: async (walletPublicKey: string): Promise<User | null> => {
    try {
      console.log('[DEBUG] Checking user for public key:', walletPublicKey)
      const response = await fetch(`${AppConfig.apiUrl}/user/${walletPublicKey}`)
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
      const response = await fetch(`${AppConfig.apiUrl}/user`, {
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

  createProfile: async (
    publicKey: string,
    profileData: {
      name: string
      age: number
      bio: string
      gender: string
      orientation: string
      heightCm?: number
      hobbies?: string[]
      country: string
      state: string
      city: string
      profession?: string
      religion?: string
    },
  ): Promise<{
    success: boolean
    message: string
  }> => {
    try {
      const payload = { publicKey, ...profileData }
      console.log('[API] createProfile - URL:', `${AppConfig.apiUrl}/user/profile`)
      console.log('[API] createProfile - Payload:', JSON.stringify(payload, null, 2))

      const response = await fetch(`${AppConfig.apiUrl}/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[API] createProfile - Status:', response.status, response.statusText)

      const data = await response.json()
      console.log('[API] createProfile - Response:', JSON.stringify(data, null, 2))

      if (data.success) {
        return {
          success: true,
          message: 'Profile created successfully',
        }
      }
      return {
        success: false,
        message: data.message || 'Failed to create profile',
      }
    } catch (error) {
      console.error('[API] createProfile - Error:', error)
      return {
        success: false,
        message: 'Failed to create profile',
      }
    }
  },

  updateProfile: async (
    publicKey: string,
    profileData: { name: string; age: number; bio: string; gender: string; orientation: string },
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey, ...profileData }),
      })
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Error updating profile:', error)
      return false
    }
  },

  setPreferences: async (
    publicKey: string,
    preferencesData: { preferredGenders: string[]; ageMin: number; ageMax: number; distanceRange: number },
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/user/${publicKey}/preferences`, {
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

  getPreferences: async (publicKey: string): Promise<Preferences | null> => {
    try {
      const response = await fetch(`${AppConfig.apiUrl}/user/${publicKey}/preferences`)
      const data = await response.json()
      if (data.success) {
        return data.data
      }
      return null
    } catch (error) {
      console.error('Error fetching preferences:', error)
      return null
    }
  },

  getSuggestions: async (publicKey: string): Promise<User | null> => {
    try {

      // payment api call 
      const data = await makeSwipeForNextSuggestion(publicKey);

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      return null
    }
  },
}
