/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

export const Colors = {
  light: {
    background: '#fff',
    border: '#e0e0e0',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    text: '#11181C',
    tint: tintColorLight,
    card: '#fff',
    cardBorder: '#f0f0f0',
    iconBackground: '#eee',
    iconPlaceholder: '#ccc',
    textSecondary: '#666',
    backgroundSecondary: '#f5f5f5',
  },
  dark: {
    background: '#151718',
    border: '#2A2C2E',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    text: '#ECEDEE',
    tint: tintColorDark,
    card: '#1F2123',
    cardBorder: '#2A2C2E',
    iconBackground: '#2A2C2E',
    iconPlaceholder: '#4A4C4E',
    textSecondary: '#9BA1A6',
    backgroundSecondary: '#1A1C1E',
  },
}