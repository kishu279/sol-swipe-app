import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = '@app_theme_mode'

interface ThemeContextType {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  isDark: boolean
  colorScheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useSystemColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode)
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error)
      } finally {
        setIsLoaded(true)
      }
    }
    loadTheme()
  }, [])

  // Save theme preference when it changes
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
      setThemeModeState(mode)
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  // Determine actual color scheme based on mode
  const colorScheme: 'light' | 'dark' =
    themeMode === 'system' ? (systemColorScheme ?? 'light') : themeMode

  const isDark = colorScheme === 'dark'

  // Don't render children until theme is loaded to prevent flash
  if (!isLoaded) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
