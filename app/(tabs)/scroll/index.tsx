import { MOCK_DATA, ScrollDataType } from '@/constants/scroll-data'
import { useSigningKey } from '@/hooks/use-signing-key'
import { useThemeColor } from '@/hooks/use-theme-color'
import { SwipeableCard } from '@/components/SwipeableCard'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
export default function ScrollScreen() {
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')

  const { hasKey } = useSigningKey()
  const [loading, setLoading] = useState(false)
  
  // Store the stack of profiles. 
  // currentlyVisibleIndex points to the card at the "top" of the pile.
  const [profiles, setProfiles] = useState<ScrollDataType[]>(MOCK_DATA)
  const [currentIndex, setCurrentIndex] = useState(0)

  // We show 2 cards: Current and Next
  const currentProfile = profiles[currentIndex]
  const nextProfile = profiles[currentIndex + 1]

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    // If no more profiles, cycle back or fetch more
    // For now, we cycle mock data if we run out, or just stop? 
    // Let's implement fetching logic if it was real.
    
    // Trigger generic "next" logic (payment/fetch) mostly on right swipe? 
    // Or every swipe consumes a "swipe"?
    // User requested "makeSwipeForNextSuggestion" triggers on every swipe generally in dating apps (paying for the view/match potential).
    // Let's assume we charge for every "interaction" that leads to a new profile?
    
    // But currently `makeSwipeForNextSuggestion` fetches the *next* suggestion.
    // So we should pre-fetch?
    
    // For this UI demo, let's just increment index and cycle if needed.
    // Logic for payment can be hooked here.
    
    if (direction === 'right') {
        console.log("Liked profile:", currentProfile?.displayName)
        // Trigger payment?
        // await triggerPayment()
    } else {
        console.log("Passed profile:", currentProfile?.displayName)
    }

    // Advance stack
    /* 
       Note: In a real app with "swipe payment", we might need to block until payment succeeds 
       before revealing the NEXT card fully? Or we pay to "unlock" the next one?
       The user prompt implies "scroll data should be visualize...".
       
       Let's keep the existing `nextProfile` logic as a background fetch for NEW data, 
       but for now we are just iterating MOCK_DATA.
    */
   
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % profiles.length)
    }, 200) // Small delay to allow animation to clear
    
  }, [currentProfile, profiles.length])

  // Optional: Trigger the actual payment logic as requested in original code?
  // The original code had a "Next" button that did: `makeSwipeForNextSuggestion`.
  // We can integrate that if we want to fetch *real* data.
  // But user said "use the static data". So we skip the generic fetch for now.

  const onSwipeLeft = () => handleSwipe('left')
  const onSwipeRight = () => handleSwipe('right')

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
                    scale={0.95} // Slightly smaller
                />
            </View>
        )}

        {/* Foreground Card (Current) */}
        <SwipeableCard 
            key={currentProfile.id}
            profile={currentProfile}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
        />
      </View>

      {/* Optional: Bottom control buttons if we want them, but swipes are enough */}
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
    marginTop: -20
  },
  nextCardContainer: {
      position: 'absolute',
      zIndex: -1,
  }
})

