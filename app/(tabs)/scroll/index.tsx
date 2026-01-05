
import { SwipeableCard, SwipeableCardRef } from '@/components/SwipeableCard'
import { MOCK_DATA, ScrollDataType } from '@/constants/scroll-data'
import { useSigningKey } from '@/hooks/use-signing-key'
import { useThemeColor } from '@/hooks/use-theme-color'
import Icon from '@expo/vector-icons/Ionicons'
import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function ScrollScreen() {
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'tint')

  const { hasKey } = useSigningKey()
  const [loading, setLoading] = useState(false)
  
  // Store the stack of profiles. 
  const [profiles, setProfiles] = useState<ScrollDataType[]>(MOCK_DATA)
  const [currentIndex, setCurrentIndex] = useState(0)

  // We show 2 cards: Current and Next
  const currentProfile = profiles[currentIndex]
  const nextProfile = profiles[currentIndex + 1]

  const cardRef = useRef<SwipeableCardRef>(null);

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    // Standard swipe logic
    if (direction === 'right') {
        console.log("Liked profile:", currentProfile?.displayName)
    } else {
        console.log("Passed profile:", currentProfile?.displayName)
    }

    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % profiles.length)
    }, 200) 
  }, [currentProfile, profiles.length])

  const onSwipeLeft = () => handleSwipe('left')
  const onSwipeRight = () => handleSwipe('right')

  // Button handlers
  const handleLikePress = () => {
      cardRef.current?.swipeRight();
  }

  const handleNopePress = () => {
      cardRef.current?.swipeLeft();
  }

  if (!currentProfile) {
      return (
          <SafeAreaView style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" />
          </SafeAreaView>
      )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Discover</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Background Card (Next) */}
        {nextProfile && (
            <View style={styles.nextCardContainer}>
                <SwipeableCard 
                    key={nextProfile.id}
                    profile={nextProfile}
                    onSwipeLeft={() => {}}
                    onSwipeRight={() => {}}
                    scale={0.95} 
                />
            </View>
        )}

        {/* Foreground Card (Current) */}
        <SwipeableCard 
            ref={cardRef}
            key={currentProfile.id}
            profile={currentProfile}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
        />
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.nopeButton]}
            onPress={handleNopePress}
          >
              <Icon name="close" size={32} color="#FF3B30" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.likeButton]}
            onPress={handleLikePress}
          >
              <Icon name="heart" size={32} color="#4CD964" />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  header: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      zIndex: 10
  },
  headerTitle: {
      fontSize: 34,
      fontWeight: 'bold',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -40 // Pull up slightly to make room for buttons
  },
  nextCardContainer: {
      position: 'absolute',
      zIndex: -1,
  },
  controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 30,
      gap: 40
  },
  button: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: 'white'
  },
  nopeButton: {
      // styles handled by icon color essentially, but can add border if needed
  },
  likeButton: {
      // 
  }
})

