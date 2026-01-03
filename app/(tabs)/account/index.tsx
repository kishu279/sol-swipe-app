import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

export default function AccountScreen() {
  const { user, refreshUser } = useUserDraft()
  const router = useRouter()

  const cardBackground = useThemeColor({}, 'card')
  const iconBackground = useThemeColor({}, 'iconBackground')
  const iconPlaceholder = useThemeColor({}, 'iconPlaceholder')
  const textSecondary = useThemeColor({}, 'textSecondary')
  const backgroundSecondary = useThemeColor({}, 'backgroundSecondary')
  const cardBorder = useThemeColor({}, 'cardBorder')

  React.useEffect(() => {
    if (user) {
      console.log('[AccountScreen] No user found, redirecting to onboarding')
    }
  }, [user])

  React.useEffect(() => {
    refreshUser()
  }, [])

  if (!user) {
    return (
      <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText type="title">No User Found</AppText>
        <AppText>Please complete onboarding or check your connection.</AppText>
      </AppView>
    )
  }

  return (
    <>
      {!user && (
        <AppView style={{ flex: 1 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              gap: 16,
              flex: 1,
            }}
          >
            <AppText type="title">No User Found</AppText>
            <TouchableOpacity
              style={{
                backgroundColor: '#000',
                padding: 12,
                borderRadius: 8,
                width: '100%',
                alignItems: 'center',
              }}
              onPress={() => router.replace('/onboarding/welcome')}
            >
              <AppText style={{ color: '#fff', fontWeight: 'bold' }}>Create Profile</AppText>
            </TouchableOpacity>
          </View>
        </AppView>
      )}

      {user && (
        <AppView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Profile Header */}
            <View style={{ alignItems: 'center', padding: 24, paddingVertical: 48, gap: 16 }}>
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: iconBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <UiIconSymbol name="person.fill" size={60} color={iconPlaceholder} />

              </View>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <AppText type="title" style={{ fontSize: 28 }}>
                  {user.displayName}, {user.age}
                </AppText>
                <AppText style={{ color: textSecondary }}>
                  {user.gender} • {user.orientation}
                </AppText>
              </View>
            </View>

            {/* Bio Section */}
            <View style={{ padding: 24, paddingTop: 0 }}>
              <View style={{ backgroundColor: cardBackground, padding: 20, borderRadius: 16, gap: 12 }}>
                <AppText type="subtitle">About Me</AppText>
                <AppText style={{ lineHeight: 24 }}>{user.bio}</AppText>
              </View>
            </View>

            {/* Preferences Section */}
            <View style={{ padding: 24, paddingTop: 0 }}>
              <View style={{ backgroundColor: cardBackground, padding: 20, borderRadius: 16, gap: 12 }}>
                <AppText type="subtitle">Preferences</AppText>
                <DetailRow label="Age Range" value={`${user.ageMin} - ${user.ageMax}`} />
                <DetailRow label="Maximum Distance" value={`${user.maxDistanceKm} km`} />
                <DetailRow label="Interested In" value={user.preferredGenders?.join(', ') || 'Any'} />
              </View>
            </View>

            {/* Developer Tools */}
            <View style={{ padding: 24, paddingTop: 0, gap: 16 }}>
              <AppText type="subtitle" style={{ fontSize: 18 }}>
                Developer Tools
              </AppText>
              <View style={{ backgroundColor: backgroundSecondary, padding: 12, borderRadius: 8 }}>
                <AppText style={{ fontFamily: 'monospace', fontSize: 10 }}>{JSON.stringify(user, null, 2)}</AppText>
              </View>
            </View>
          </ScrollView>
        </AppView>
      )}
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const textSecondary = useThemeColor({}, 'textSecondary')
  const cardBorder = useThemeColor({}, 'cardBorder')

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: cardBorder,
      }}
    >
      <AppText style={{ color: textSecondary }}>{label}</AppText>
      <AppText style={{ fontWeight: '600' }}>{value}</AppText>
    </View>
  )
}
