import { MOCK_DATA, ScrollDataType } from '@/constants/scroll-data'
import { useSigningKey } from '@/hooks/use-signing-key'
import { useThemeColor } from '@/hooks/use-theme-color'
import { makeSwipeForNextSuggestion, PaymentFailedError, SigningKeyNotConfiguredError } from '@/lib/payment'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function ScrollScreen() {
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const tintColor = useThemeColor({}, 'tint')

  const { hasKey } = useSigningKey()
  const [loading, setLoading] = React.useState(false)
  const [selectedProfile, setSelectedProfile] = React.useState<ScrollDataType | null>(null)

  const nextProfile = useCallback(async () => {
    // Check if signing key is configured
    if (!hasKey) {
      Alert.alert(
        'Signing Key Required',
        'Please configure your signing key in Settings to enable swipe payments.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => router.push('/(tabs)/settings') },
        ]
      )
      return
    }

    setLoading(true)
    try {
      // TODO: Replace with actual user's public key from auth
      const userPublicKey = 'YOUR_USER_PUBLIC_KEY'
      
      // Make payment and fetch next profile
      const response = await makeSwipeForNextSuggestion(userPublicKey)

      // console.log("[DEBUG]: calling the next function")
      
      if (response.success && response.data) {
        // Use the data from API
        setSelectedProfile(response.data)
        console.log('GOT THE DATA', response.data)
      } else {
        // Fallback to mock data for now
        // const next = MOCK_DATA[Math.floor(Math.random() * MOCK_DATA.length)]
        // setSelectedProfile(next)
        console.log("[DEBUG] error while fetching the data from the backend")
      }
    } catch (error) {
      if (error instanceof SigningKeyNotConfiguredError) {
        Alert.alert(
          'Signing Key Required',
          'Please configure your signing key in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Settings', onPress: () => router.push('/(tabs)/settings') },
          ]
        )
      } else if (error instanceof PaymentFailedError) {
        Alert.alert(
          'Payment Failed',
          `Unable to process payment: ${error.message}. Please check your balance and try again.`
        )
      } else {
        console.error('Error fetching next profile:', error)
        Alert.alert('Error', 'Failed to fetch next profile. Please try again.')
      }
      
      // Fallback to mock data on error
      const next = MOCK_DATA[Math.floor(Math.random() * MOCK_DATA.length)]
      setSelectedProfile(next)
    } finally {
      setLoading(false)
    }
  }, [hasKey])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* {MOCK_DATA.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} textColor={textColor} borderColor={borderColor} />
        ))} */}

        {selectedProfile ? (
          <ProfileCard profile={selectedProfile} textColor={textColor} borderColor={borderColor} />
        ) : (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: textColor, fontSize: 18, marginBottom: 20 }}>No profile selected</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity 
        onPress={nextProfile} 
        style={[styles.nextButton, { backgroundColor: loading ? '#aaa' : tintColor }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Next</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  )
}

interface ProfileCardProps {
  profile: ScrollDataType
  textColor: string
  borderColor: string
}

function ProfileCard({ profile, textColor, borderColor }: ProfileCardProps) {
  const cardBackground = useThemeColor({}, 'background')
  const nameColor = useThemeColor({}, 'tint')
  const locationColor = useThemeColor({}, 'text')

  return (
    <View style={[styles.card, { borderColor, backgroundColor: cardBackground }]}>
      {/* Main Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: profile.profileImage }} style={styles.mainImage} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imageGradient} />
        <View style={styles.nameOverlay}>
          <Text style={[styles.name, { color: nameColor }]}>
            {profile.displayName}, {profile.age}
          </Text>
          <Text style={[styles.location, { color: locationColor }]}>{profile.location}</Text>
        </View>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        {/* Bio */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
          <Text style={[styles.bio, { color: textColor }]}>{profile.bio}</Text>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Basic Info</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Gender:</Text>
            <Text style={[styles.value, { color: textColor }]}>{profile.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Orientation:</Text>
            <Text style={[styles.value, { color: textColor }]}>{profile.orientation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Height:</Text>
            <Text style={[styles.value, { color: textColor }]}>{profile.heightCm} cm</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Profession:</Text>
            <Text style={[styles.value, { color: textColor }]}>{profile.profession}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Religion:</Text>
            <Text style={[styles.value, { color: textColor }]}>{profile.religion}</Text>
          </View>
        </View>

        {/* Hobbies */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Hobbies & Interests</Text>
          <View style={styles.tagsContainer}>
            {profile.hobbies.map((hobby, idx) => (
              <View key={idx} style={[styles.tag, { borderColor }]}>
                <Text style={[styles.tagText, { color: textColor }]}>{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Looking For</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Gender:</Text>
            <Text style={[styles.value, { color: textColor }]}>{profile.preferences.preferredGenders.join(', ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Age Range:</Text>
            <Text style={[styles.value, { color: textColor }]}>
              {profile.preferences.ageMin} - {profile.preferences.ageMax}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: textColor, opacity: 0.6 }]}>Distance:</Text>
            <Text style={[styles.value, { color: textColor }]}>Within {profile.preferences.maxDistanceKm} km</Text>
          </View>
        </View>

        {/* Additional Photos */}
        {profile.images.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>More Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photosRow}>
                {profile.images.map((image, idx) => (
                  <Image key={idx} source={{ uri: image }} style={styles.thumbnail} />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    position: 'relative',
  },
  card: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    // backgroundColor is now set via props for theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    opacity: 0.9,
  },
  detailsContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    width: 110,
  },
  value: {
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  photosRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,

    right: 20,
    backgroundColor: '#dcb6de',
    height: 50,
    width: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    animationDelay: 500,

    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
  },
})
