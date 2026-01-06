import { useAppTheme } from '@/components/app-theme'
import { useUserDraft } from '@/components/state/user-details-provider'
import { useSigningKey } from '@/hooks/use-signing-key'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type DebugLink = {
  label: string
  route: string
  description: string
}

const debugLinks: DebugLink[] = [
  // Onboarding
  { label: 'Sign In', route: '/sign-in', description: 'Login/register screen' },
  { label: 'Welcome', route: '/onboarding/welcome', description: 'Onboarding welcome' },
  { label: 'Profile Setup', route: '/onboarding/profile', description: 'Create profile' },
  { label: 'Preferences', route: '/onboarding/preferences', description: 'Set preferences' },
  { label: 'Prompts', route: '/onboarding/prompt', description: 'Add prompts/answers' },

  // Main tabs
  { label: 'Account', route: '/(tabs)/account', description: 'Wallet & account' },
  { label: 'Scroll', route: '/(tabs)/scroll', description: 'Main swipe view' },
  { label: 'Settings', route: '/(tabs)/settings', description: 'App settings' },
]

export default function DebugScreen() {
  const { isDark } = useAppTheme()
  const insets = useSafeAreaInsets()
  const { user, draft } = useUserDraft()
  const { hasKey, publicKey, getKey, checkingKey } = useSigningKey()
  const [privateKeyPreview, setPrivateKeyPreview] = useState<string | null>(null)
  const [showPrivateKey, setShowPrivateKey] = useState(false)

  useEffect(() => {
    if (showPrivateKey) {
      getKey().then((key) => {
        if (key) {
          // Show first 8 and last 8 chars for safety
          setPrivateKeyPreview(`${key.slice(0, 8)}...${key.slice(-8)}`)
        }
      })
    } else {
      setPrivateKeyPreview(null)
    }
  }, [showPrivateKey])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5',
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 16,
    },
    header: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
    },
    subheader: {
      fontSize: 14,
      color: isDark ? '#888' : '#666',
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#666' : '#999',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 24,
      marginBottom: 8,
    },
    card: {
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#2a2a2a' : '#e0e0e0',
    },
    cardPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.98 }],
    },
    cardLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    cardDescription: {
      fontSize: 13,
      color: isDark ? '#888' : '#666',
      marginTop: 4,
    },
    cardRoute: {
      fontSize: 11,
      color: isDark ? '#555' : '#aaa',
      marginTop: 6,
      fontFamily: 'monospace',
    },
    dataCard: {
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#2a2a2a' : '#e0e0e0',
    },
    dataTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 12,
    },
    dataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2a2a2a' : '#f0f0f0',
    },
    dataKey: {
      fontSize: 12,
      color: isDark ? '#888' : '#666',
      flex: 1,
    },
    dataValue: {
      fontSize: 12,
      color: isDark ? '#fff' : '#000',
      flex: 2,
      textAlign: 'right',
      fontFamily: 'monospace',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    statusBadgeText: {
      fontSize: 11,
      fontWeight: '600',
    },
    toggleButton: {
      backgroundColor: isDark ? '#333' : '#e0e0e0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    toggleButtonText: {
      fontSize: 12,
      color: isDark ? '#fff' : '#000',
    },
    emptyText: {
      fontSize: 13,
      color: isDark ? '#555' : '#aaa',
      fontStyle: 'italic',
    },
    jsonPreview: {
      fontFamily: 'monospace',
      fontSize: 10,
      color: isDark ? '#888' : '#666',
      backgroundColor: isDark ? '#111' : '#f5f5f5',
      padding: 8,
      borderRadius: 6,
      marginTop: 8,
    },
  })

  const navigateTo = (route: string) => {
    router.push(route as any)
  }

  const renderDataRow = (key: string, value: any) => {
    let displayValue = value
    if (value === null || value === undefined) {
      displayValue = '—'
    } else if (Array.isArray(value)) {
      displayValue = value.length > 0 ? value.join(', ') : '[]'
    } else if (typeof value === 'object') {
      displayValue = JSON.stringify(value)
    } else {
      displayValue = String(value)
    }

    return (
      <View key={key} style={styles.dataRow}>
        <Text style={styles.dataKey}>{key}</Text>
        <Text style={styles.dataValue} numberOfLines={2}>
          {displayValue}
        </Text>
      </View>
    )
  }

  const StatusBadge = ({ label, status }: { label: string; status: boolean }) => (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: status ? (isDark ? '#1a3d1a' : '#d4edda') : isDark ? '#3d1a1a' : '#f8d7da' },
      ]}
    >
      <Text style={[styles.statusBadgeText, { color: status ? '#28a745' : '#dc3545' }]}>
        {label}: {status ? '✓ Yes' : '✗ No'}
      </Text>
    </View>
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>🛠️ Debug Panel</Text>
      <Text style={styles.subheader}>App state & navigation</Text>

      {/* Status Checks */}
      <Text style={styles.sectionTitle}>Status Checks</Text>
      <View style={styles.dataCard}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <StatusBadge label="User Profile" status={!!user} />
          <StatusBadge label="Signing Key" status={hasKey} />
          <StatusBadge label="Draft Data" status={Object.keys(draft).length > 0} />
        </View>
      </View>

      {/* Signing Key Info */}
      <Text style={styles.sectionTitle}>Signing Key</Text>
      <View style={styles.dataCard}>
        <Text style={styles.dataTitle}>🔐 Key Status</Text>
        {checkingKey ? (
          <Text style={styles.emptyText}>Checking...</Text>
        ) : hasKey ? (
          <>
            {renderDataRow('hasKey', hasKey)}
            {renderDataRow('publicKey', publicKey || 'Deriving...')}
            {showPrivateKey && privateKeyPreview && renderDataRow('privateKey (partial)', privateKeyPreview)}
            <Pressable style={styles.toggleButton} onPress={() => setShowPrivateKey(!showPrivateKey)}>
              <Text style={styles.toggleButtonText}>{showPrivateKey ? 'Hide Private Key' : 'Show Private Key'}</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.emptyText}>No signing key configured</Text>
        )}
      </View>

      {/* User Profile */}
      <Text style={styles.sectionTitle}>User Profile (Saved)</Text>
      <View style={styles.dataCard}>
        <Text style={styles.dataTitle}>👤 Profile Data</Text>
        {user ? (
          <>
            {renderDataRow('walletPublicKey', user.walletPublicKey)}
            {renderDataRow('displayName', user.displayName)}
            {renderDataRow('age', user.age)}
            {renderDataRow('gender', user.gender)}
            {renderDataRow('orientation', user.orientation)}
            {renderDataRow('heightCm', user.heightCm)}
            {renderDataRow('country', user.country)}
            {renderDataRow('state', user.state)}
            {renderDataRow('city', user.city)}
            {renderDataRow('profession', user.profession)}
            {renderDataRow('religion', user.religion)}
            {renderDataRow('hobbies', user.hobbies)}
            {renderDataRow('bio', user.bio)}
          </>
        ) : (
          <Text style={styles.emptyText}>No user profile saved</Text>
        )}
      </View>

      {/* User Preferences */}
      <Text style={styles.sectionTitle}>User Preferences</Text>
      <View style={styles.dataCard}>
        <Text style={styles.dataTitle}>💕 Dating Preferences</Text>
        {user ? (
          <>
            {renderDataRow('ageMin', user.ageMin)}
            {renderDataRow('ageMax', user.ageMax)}
            {renderDataRow('maxDistanceKm', user.maxDistanceKm)}
            {renderDataRow('preferredGenders', user.preferredGenders)}
          </>
        ) : (
          <Text style={styles.emptyText}>No preferences set</Text>
        )}
      </View>

      {/* Prompt Answers */}
      <Text style={styles.sectionTitle}>Prompt Answers</Text>
      <View style={styles.dataCard}>
        <Text style={styles.dataTitle}>💬 Q&A</Text>
        {user?.promptAnswers && user.promptAnswers.length > 0 ? (
          user.promptAnswers.map((p, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              {renderDataRow(`Q${i + 1}`, p.questionId)}
              {renderDataRow(`A${i + 1}`, p.answer)}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No prompt answers</Text>
        )}
      </View>

      {/* Draft Data */}
      <Text style={styles.sectionTitle}>Draft Data (Unsaved)</Text>
      <View style={styles.dataCard}>
        <Text style={styles.dataTitle}>📝 Current Draft</Text>
        {Object.keys(draft).length > 0 ? (
          <Text style={styles.jsonPreview}>{JSON.stringify(draft, null, 2)}</Text>
        ) : (
          <Text style={styles.emptyText}>No draft data</Text>
        )}
      </View>

      {/* Navigation */}
      <Text style={styles.sectionTitle}>Onboarding Pages</Text>
      {debugLinks.slice(0, 5).map((link) => (
        <Pressable
          key={link.route}
          onPress={() => navigateTo(link.route)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <Text style={styles.cardLabel}>{link.label}</Text>
          <Text style={styles.cardDescription}>{link.description}</Text>
          <Text style={styles.cardRoute}>{link.route}</Text>
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>Main Tabs</Text>
      {debugLinks.slice(5).map((link) => (
        <Pressable
          key={link.route}
          onPress={() => navigateTo(link.route)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <Text style={styles.cardLabel}>{link.label}</Text>
          <Text style={styles.cardDescription}>{link.description}</Text>
          <Text style={styles.cardRoute}>{link.route}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}
