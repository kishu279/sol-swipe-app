import { ScrollDataType } from '@/constants/scroll-data'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useState } from 'react'

// CONTEXT TYPE
export interface ScrollDataContextType {
    currentProfile: ScrollDataType | null
    setCurrentProfile: (profile: ScrollDataType) => Promise<void>
    clearProfile: () => Promise<void>
    isLoading: boolean
}

// CREATE CONTEXT
export const ScrollDataContext = createContext<ScrollDataContextType | undefined>(undefined)

// STORAGE KEY
export const SCROLL_PROFILE_STORAGE_KEY = 'current_scroll_profile'

// HOOK
export function useScrollData() {
    const context = useContext(ScrollDataContext)
    if (!context) {
        throw new Error('useScrollData must be used within a ScrollDataProvider')
    }
    return context
}

// PROVIDER COMPONENT
export function ScrollDataProvider({ children }: { children: React.ReactNode }) {
    const [currentProfile, setCurrentProfileState] = useState<ScrollDataType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load from AsyncStorage on mount
    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const stored = await AsyncStorage.getItem(SCROLL_PROFILE_STORAGE_KEY)
            if (stored) {
                setCurrentProfileState(JSON.parse(stored))
            }
        } catch (e) {
            console.error('[ScrollDataProvider] Failed to load profile:', e)
        } finally {
            setIsLoading(false)
        }
    }

    const setCurrentProfile = async (profile: ScrollDataType) => {
        try {
            setCurrentProfileState(profile)
            await AsyncStorage.setItem(SCROLL_PROFILE_STORAGE_KEY, JSON.stringify(profile))
        } catch (e) {
            console.error('[ScrollDataProvider] Failed to save profile:', e)
        }
    }

    const clearProfile = async () => {
        try {
            setCurrentProfileState(null)
            await AsyncStorage.removeItem(SCROLL_PROFILE_STORAGE_KEY)
        } catch (e) {
            console.error('[ScrollDataProvider] Failed to clear profile:', e)
        }
    }

    return (
        <ScrollDataContext.Provider value={{ currentProfile, setCurrentProfile, clearProfile, isLoading }}>
            {children}
        </ScrollDataContext.Provider>
    )
}
