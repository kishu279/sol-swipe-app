import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { ThemeMode, useTheme } from '@/components/theme-context'
import { useThemeColor } from '@/hooks/use-theme-color'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'light', label: 'Light', icon: '☀️' },
  { mode: 'dark', label: 'Dark', icon: '🌙' },
  { mode: 'system', label: 'System', icon: '⚙️' },
]

export function SettingsThemeToggle() {
  const { themeMode, setThemeMode } = useTheme()
  const tintColor = useThemeColor({}, 'tint')
  const borderColor = useThemeColor({}, 'border')
  const cardBackground = useThemeColor({}, 'card')

  return (
    <AppView>
      <AppText type="subtitle">Appearance</AppText>
      <View style={styles.optionsContainer}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = themeMode === option.mode
          return (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? tintColor + '20' : cardBackground,
                  borderColor: isSelected ? tintColor : borderColor,
                },
              ]}
              onPress={() => setThemeMode(option.mode)}
              activeOpacity={0.7}
            >
              <AppText style={styles.icon}>{option.icon}</AppText>
              <AppText
                type={isSelected ? 'defaultSemiBold' : 'default'}
                style={[
                  styles.label,
                  isSelected && { color: tintColor },
                ]}
              >
                {option.label}
              </AppText>
            </TouchableOpacity>
          )
        })}
      </View>
    </AppView>
  )
}

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
  },
})
