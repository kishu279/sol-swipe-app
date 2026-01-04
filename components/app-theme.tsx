import { ThemeProvider as AppThemeProvider, useTheme } from '@/components/theme-context'
import { DarkTheme as AppThemeDark, DefaultTheme as AppThemeLight, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import { PropsWithChildren } from 'react'

export function useAppTheme() {
  const { isDark, colorScheme } = useTheme()
  const theme = isDark ? AppThemeDark : AppThemeLight
  return {
    colorScheme,
    isDark,
    theme,
  }
}

function AppThemeInner({ children }: PropsWithChildren) {
  const { theme } = useAppTheme()
  return <NavigationThemeProvider value={theme}>{children}</NavigationThemeProvider>
}

export function AppTheme({ children }: PropsWithChildren) {
  return (
    <AppThemeProvider>
      <AppThemeInner>{children}</AppThemeInner>
    </AppThemeProvider>
  )
}
