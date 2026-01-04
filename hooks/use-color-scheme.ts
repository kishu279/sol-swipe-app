import { useTheme } from '@/components/theme-context'

export function useColorScheme(): 'light' | 'dark' {
    const { colorScheme } = useTheme()
    return colorScheme
}
