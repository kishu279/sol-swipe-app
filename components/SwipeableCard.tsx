
import { ScrollDataType } from '@/constants/scroll-data';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeableCardProps {
  profile: ScrollDataType;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  scale?: number; // For background cards to scale up
}

export interface SwipeableCardRef {
    swipeLeft: () => void;
    swipeRight: () => void;
}

export const SwipeableCard = forwardRef<SwipeableCardRef, SwipeableCardProps>(({ profile, onSwipeLeft, onSwipeRight, scale = 1 }, ref) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardScale = useSharedValue(scale);

  // Colors
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'background');

  // Expose swipe methods to parent
  useImperativeHandle(ref, () => ({
      swipeLeft: () => {
          translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
              runOnJS(onSwipeLeft)();
          });
      },
      swipeRight: () => {
          translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
              runOnJS(onSwipeRight)();
          });
      }
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe detected
        const direction = event.translationX > 0 ? 'right' : 'left';
        
        // Fly off screen
        translateX.value = withTiming(
          direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
          { duration: 250 },
          () => {
             if (direction === 'right') {
               runOnJS(onSwipeRight)();
             } else {
               runOnJS(onSwipeLeft)();
             }
          }
        );
      } else {
        // Reset position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: withSpring(cardScale.value) },
      ],
    };
  });

  // Stamp animations
  const likeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
        translateX.value,
        [0, SCREEN_WIDTH / 4],
        [0, 1],
        Extrapolation.CLAMP
    )
  }));

  const nopeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
        translateX.value,
        [-SCREEN_WIDTH / 4, 0],
        [1, 0],
        Extrapolation.CLAMP
    )
  }));


  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, { backgroundColor: cardBackground }, animatedStyle]}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: profile.profileImage }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Text Overlay */}
          <View style={styles.overlay}>
            <Text style={[styles.name, { color: 'white' }]}>
              {profile.displayName}, {profile.age}
            </Text>
            <Text style={[styles.bio, { color: 'rgba(255,255,255,0.9)' }]} numberOfLines={2}>
              {profile.bio}
            </Text>
          </View>
        </View>

        {/* Info Section */}
       <View style={styles.infoSection}>
           <View style={styles.tagsContainer}>
                {profile.hobbies.slice(0, 3).map((hobby, i) => (
                    <View key={i} style={[styles.tag, { borderColor: tintColor }]}>
                        <Text style={{color: textColor, fontSize: 12}}>{hobby}</Text>
                    </View>
                ))}
           </View>

           {/* Show first question only to fit space */}
           {(profile.questions || []).slice(0, 1).map((q, i) => (
               <View key={i} style={styles.questionContainer}>
                   <Text style={[styles.questionText, { color: tintColor }]}>{q.question}</Text>
                   <Text style={[styles.answerText, { color: textColor }]}>{q.answer}</Text>
               </View>
           ))}

           {/* Preferences Section */}
           <View style={styles.preferencesContainer}>
               <Text style={[styles.prefTitle, { color: tintColor }]}>Looking For</Text>
               <View style={styles.prefRow}>
                   <Text style={[styles.prefText, { color: textColor }]}>
                       {profile.preferences.preferredGenders.join(', ')}
                   </Text>
                   <Text style={[styles.prefText, { color: textColor }]}>•</Text>
                   <Text style={[styles.prefText, { color: textColor }]}>
                       {profile.preferences.ageMin}-{profile.preferences.ageMax} y/o
                   </Text>
                   <Text style={[styles.prefText, { color: textColor }]}>•</Text>
                   <Text style={[styles.prefText, { color: textColor }]}>
                       {profile.preferences.maxDistanceKm}km
                   </Text>
               </View>
           </View>
       </View>


        {/* Like/Nope Stamps */}
        <Animated.View style={[styles.stamp, styles.likeStamp, likeOpacityStyle]}>
            <Text style={styles.likeText}>LIKE</Text>
        </Animated.View>

        <Animated.View style={[styles.stamp, styles.nopeStamp, nopeOpacityStyle]}>
            <Text style={styles.nopeText}>NOPE</Text>
        </Animated.View>

      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.75,
    borderRadius: 24,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 0.55,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  overlay: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bio: {
    fontSize: 15,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoSection: {
      flex: 0.45,
      padding: 20,
      justifyContent: 'flex-start',
  },
  tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16
  },
  tag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
  },
  questionContainer: {
      marginBottom: 12
  },
  questionText: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 2,
      opacity: 0.8
  },
  answerText: {
      fontSize: 16,
      fontWeight: '500',
  },
  preferencesContainer: {
      marginTop: 'auto', // Push to bottom of info section
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)'
  },
  prefTitle: {
      fontSize: 12,
      fontWeight: '700',
      marginBottom: 4,
      opacity: 0.7,
      textTransform: 'uppercase'
  },
  prefRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
  },
  prefText: {
      fontSize: 13,
      fontWeight: '600'
  },
  
  // Stamps
  stamp: {
      position: 'absolute',
      top: 40,
      borderWidth: 4,
      borderRadius: 10,
      padding: 8,
      transform: [{rotate: '-15deg'}],
      zIndex: 10
  },
  likeStamp: {
      left: 40,
      borderColor: '#4CD964',
  },
  nopeStamp: {
      right: 40,
      borderColor: '#FF3B30',
      transform: [{rotate: '15deg'}]
  },
  likeText: {
      color: '#4CD964',
      fontSize: 32,
      fontWeight: 'bold',
      letterSpacing: 2
  },
  nopeText: {
      color: '#FF3B30',
      fontSize: 32,
      fontWeight: 'bold',
      letterSpacing: 2
  }
});