import { MOCK_DATA } from '@/constants/scroll-data';
import { useThemeColor } from '@/hooks/use-theme-color';
import Icon from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  // Card colors from theme - ensures proper contrast
  const cardBg = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');

  const profile = MOCK_DATA.find(p => p.id === id);

  if (!profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>Profile not found</Text>
      </SafeAreaView>
    );
  }

  // Interleave photos and prompts for a Hinge-style feed
  const allImages = [profile.profileImage, ...(profile.images || [])];
  const questions = profile.questions || [];

  // Build content: main photo -> info -> prompts & photos alternating
  const contentItems: { type: 'photo' | 'prompt' | 'info'; data: any; index: number }[] = [];
  
  // Add main photo first with name overlay
  contentItems.push({ type: 'photo', data: { uri: allImages[0], isMain: true }, index: 0 });
  
  // Add info card right after main photo (user details, preferences, etc.)
  contentItems.push({ type: 'info', data: profile, index: 0 });
  
  // Alternate remaining photos with prompts
  const maxItems = Math.max(allImages.length - 1, questions.length);
  for (let i = 0; i < maxItems; i++) {
    if (i < questions.length) {
      contentItems.push({ type: 'prompt', data: questions[i], index: i });
    }
    if (i + 1 < allImages.length) {
      contentItems.push({ type: 'photo', data: { uri: allImages[i + 1], isMain: false }, index: i + 1 });
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      {/* Floating Back Button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.floatingBack}
      >
        <Icon name="chevron-down" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {contentItems.map((item, idx) => {
          if (item.type === 'photo') {
            const isMain = item.data.isMain;
            return (
              <View key={`photo-${item.index}`} style={isMain ? styles.mainPhotoCard : styles.galleryPhotoCard}>
                <Image source={{ uri: item.data.uri }} style={isMain ? styles.mainPhoto : styles.galleryPhoto} />
                {item.data.isMain && (
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.photoGradient}
                  >
                    <View style={styles.nameOverlay}>
                      <Text style={styles.nameText}>
                        {profile.displayName}, {profile.age}
                      </Text>
                      <View style={styles.locationRow}>
                        <Icon name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.locationText}>{profile.location}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                )}
              </View>
            );
          }

          if (item.type === 'prompt') {
            return (
              <View key={`prompt-${item.index}`} style={[styles.promptCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <Text style={[styles.promptQuestion, { color: textColor, opacity: 0.6 }]}>
                  {item.data.question}
                </Text>
                <Text style={[styles.promptAnswer, { color: textColor }]}>
                  {item.data.answer}
                </Text>
              </View>
            );
          }

          if (item.type === 'info') {
            return (
              <View key="info" style={[styles.infoCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                {/* Bio */}
                <Text style={[styles.bioText, { color: textColor }]}>
                  {profile.bio}
                </Text>

                {/* Details Row */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Icon name="briefcase-outline" size={20} color={tintColor} />
                    <Text style={[styles.detailLabel, { color: textColor, opacity: 0.6 }]}>Work</Text>
                    <Text style={[styles.detailValue, { color: textColor }]}>{profile.profession}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="resize-outline" size={20} color={tintColor} />
                    <Text style={[styles.detailLabel, { color: textColor, opacity: 0.6 }]}>Height</Text>
                    <Text style={[styles.detailValue, { color: textColor }]}>{profile.heightCm} cm</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="heart-outline" size={20} color={tintColor} />
                    <Text style={[styles.detailLabel, { color: textColor, opacity: 0.6 }]}>Orientation</Text>
                    <Text style={[styles.detailValue, { color: textColor }]}>{profile.orientation}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="globe-outline" size={20} color={tintColor} />
                    <Text style={[styles.detailLabel, { color: textColor, opacity: 0.6 }]}>Religion</Text>
                    <Text style={[styles.detailValue, { color: textColor }]}>{profile.religion}</Text>
                  </View>
                </View>

                {/* Hobbies */}
                <View style={styles.hobbiesSection}>
                  <Text style={[styles.sectionLabel, { color: textColor, opacity: 0.6 }]}>Interests</Text>
                  <View style={styles.hobbiesRow}>
                    {profile.hobbies.map((hobby, i) => (
                      <View key={i} style={[styles.hobbyTag, { backgroundColor: tintColor + '20', borderColor: tintColor }]}>
                        <Text style={[styles.hobbyText, { color: tintColor }]}>{hobby}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Looking For */}
                <View style={styles.lookingForSection}>
                  <Text style={[styles.sectionLabel, { color: textColor, opacity: 0.6 }]}>Looking for</Text>
                  <Text style={[styles.lookingForText, { color: textColor }]}>
                    {profile.preferences.preferredGenders.join(' or ')} • {profile.preferences.ageMin}-{profile.preferences.ageMax} years
                  </Text>
                </View>
              </View>
            );
          }

          return null;
        })}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingBack: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Main Photo Card (full width)
  mainPhotoCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.15,
    marginBottom: 12,
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Gallery Photo Card (smaller with rounded corners)
  galleryPhotoCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryPhoto: {
    width: SCREEN_WIDTH - 32,
    height: (SCREEN_WIDTH - 32) * 0.85,
    resizeMode: 'cover',
  },
  photoGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    justifyContent: 'flex-end',
  },
  nameOverlay: {
    padding: 20,
    paddingBottom: 24,
  },
  nameText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  },

  // Prompt Card
  promptCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  promptQuestion: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  promptAnswer: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 30,
  },

  // Info Card
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  bioText: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  detailItem: {
    width: '45%',
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  hobbiesSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  hobbiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  hobbyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lookingForSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
  },
  lookingForText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
