
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useUserDraft } from '@/components/state/user-details-provider'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import React from 'react'
import { ScrollView, View } from 'react-native'

export default function AccountScreen() {
  const { user } = useUserDraft()

  React.useEffect(() => {
    console.log("[DEBUG] user", {user})
  }, [user])

  if (!user) {
    return (
      <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText>No user profile found.</AppText>
      </AppView>
    )
  }

  return (
    <AppView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Profile Header */}
        <View style={{ alignItems: 'center', padding: 24, paddingVertical: 48, gap: 16 }}>
          <View style={{ 
            width: 120, 
            height: 120, 
            borderRadius: 60, 
            backgroundColor: '#eee', 
            justifyContent: 'center', 
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5
          }}>
            <UiIconSymbol name="person.fill" size={60} color="#ccc" />
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <AppText type="title" style={{ fontSize: 28 }}>{user.displayName}, {user.age}</AppText>
            <AppText style={{ color: '#666' }}>{user.gender} • {user.orientation}</AppText>
          </View>
        </View>

        {/* Bio Section */}
        <View style={{ padding: 24, paddingTop: 0 }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 16, gap: 12 }}>
            <AppText type="subtitle">About Me</AppText>
            <AppText style={{ lineHeight: 24 }}>{user.bio}</AppText>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={{ padding: 24, paddingTop: 0 }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 16, gap: 12 }}>
            <AppText type="subtitle">Preferences</AppText>
            <DetailRow label="Age Range" value={`${user.ageMin} - ${user.ageMax}`} />
            <DetailRow label="Maximum Distance" value={`${user.maxDistanceKm} km`} />
            <DetailRow label="Interested In" value={user.preferredGenders?.join(', ') || 'Any'} />
          </View>
        </View>

        {/* Debug Info */}
        <View style={{ padding: 24, paddingTop: 0, opacity: 0.5 }}>
           <AppText style={{ fontSize: 12 }}>Wallet: {user.walletPublicKey?.slice(0, 8)}...</AppText>
        </View>
      </ScrollView>
    </AppView>
  )
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
      <AppText style={{ color: '#666' }}>{label}</AppText>
      <AppText style={{ fontWeight: '600' }}>{value}</AppText>
    </View>
  )
}
