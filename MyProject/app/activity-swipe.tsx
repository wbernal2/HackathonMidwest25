import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RoomAPI from '../services/RoomAPI';

const { width: screenWidth } = Dimensions.get('window');

interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  emoji: string;
  time: string;
  cost: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Bowling Night",
    description: "Strike up some fun at the local bowling alley",
    category: "Entertainment",
    emoji: "🎳",
    time: "2-3 hours",
    cost: "$15-25"
  },
  {
    id: 2,
    title: "Coffee Shop Hangout",
    description: "Chill conversation over great coffee",
    category: "Food & Drink",
    emoji: "☕",
    time: "1-2 hours",
    cost: "$5-10"
  },
  {
    id: 3,
    title: "Mini Golf",
    description: "18 holes of mini golf competition",
    category: "Outdoor",
    emoji: "⛳",
    time: "1-2 hours",
    cost: "$10-15"
  },
  {
    id: 4,
    title: "Movie Theater",
    description: "Catch the latest blockbuster",
    category: "Entertainment",
    emoji: "🎬",
    time: "2-3 hours",
    cost: "$12-18"
  },
  {
    id: 5,
    title: "Escape Room",
    description: "Work together to solve puzzles and escape",
    category: "Adventure",
    emoji: "🔐",
    time: "1 hour",
    cost: "$25-35"
  },
  {
    id: 6,
    title: "Hiking Trail",
    description: "Explore nature on a scenic trail",
    category: "Outdoor",
    emoji: "🥾",
    time: "2-4 hours",
    cost: "Free"
  },
  {
    id: 7,
    title: "Karaoke Night",
    description: "Sing your heart out with friends",
    category: "Entertainment",
    emoji: "🎤",
    time: "2-3 hours",
    cost: "$20-30"
  },
  {
    id: 8,
    title: "Food Truck Festival",
    description: "Try diverse cuisines from local food trucks",
    category: "Food & Drink",
    emoji: "🚚",
    time: "1-2 hours",
    cost: "$15-25"
  },
  {
    id: 9,
    title: "Art Museum",
    description: "Explore creative exhibitions and culture",
    category: "Culture",
    emoji: "🎨",
    time: "2-3 hours",
    cost: "$12-20"
  },
  {
    id: 10,
    title: "Beach Volleyball",
    description: "Fun in the sun with competitive games",
    category: "Sports",
    emoji: "🏐",
    time: "2-3 hours",
    cost: "Free"
  }
];

export default function ActivitySwipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get room and participant info from navigation params
  const roomCode = params.roomCode as string;
  const participantId = params.participantId as string;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedActivities, setLikedActivities] = useState<Activity[]>([]);
  const [passedActivities, setPassedActivities] = useState<Activity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const submitSwipesToDatabase = async (liked: Activity[], passed: Activity[]) => {
    if (!roomCode || !participantId) {
      Alert.alert('Error', 'Missing room or participant information');
      return false;
    }

    setIsSubmitting(true);

    try {
      // Convert activities to just their titles/IDs
      const likedTitles = liked.map(activity => activity.title);
      const passedTitles = passed.map(activity => activity.title);

      const result = await RoomAPI.submitSwipes(roomCode, participantId, likedTitles, passedTitles);

      if (result.success) {
        console.log('Swipes submitted successfully');
        return true;
      } else {
        Alert.alert('Error', result.message || 'Failed to submit swipes');
        return false;
      }
    } catch (error) {
      console.error('Error submitting swipes:', error);
      Alert.alert('Error', 'Failed to submit swipes. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= activities.length) return;

    const newAnimatedValue = direction === 'right' ? 300 : -300;
    
    Animated.timing(translateX, {
      toValue: newAnimatedValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const currentActivity = activities[currentIndex];
      
      // Update the arrays with the current swipe
      let updatedLiked = likedActivities;
      let updatedPassed = passedActivities;
      
      if (direction === 'right') {
        updatedLiked = [...likedActivities, currentActivity];
        setLikedActivities(updatedLiked);
      } else {
        updatedPassed = [...passedActivities, currentActivity];
        setPassedActivities(updatedPassed);
      }
      
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      
      // Check if we've completed all activities
      if (newIndex >= activities.length) {
        // Submit swipes to database before navigating
        setTimeout(async () => {
          const success = await submitSwipesToDatabase(updatedLiked, updatedPassed);
          if (success) {
            router.push({
              pathname: '/results-waiting-room',
              params: { roomCode, participantId }
            });
          }
        }, 1000); // Small delay to show completion message
      }
      
      translateX.setValue(0);
    });
  };

  const handleShowResults = async () => {
    console.log('Liked activities:', likedActivities);
    console.log('Passed activities:', passedActivities);
    
    // Submit current swipes and navigate to results
    const success = await submitSwipesToDatabase(likedActivities, passedActivities);
    if (success && roomCode && participantId) {
      router.push({
        pathname: '/results-waiting-room',
        params: { roomCode, participantId }
      });
    }
  };

  const handleLike = () => handleSwipe('right');
  const handlePass = () => handleSwipe('left');

  const currentActivity = activities[currentIndex];
  const remainingCount = activities.length - currentIndex;

  if (currentIndex >= activities.length) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedTitle}>COMPLETE</Text>
        <Text style={styles.completedSubtitle}>
          You swiped through all 10 activities!{'\n'}
          Liked {likedActivities.length} • Passed {passedActivities.length}
        </Text>
        <TouchableOpacity style={styles.resultsButton} onPress={handleShowResults}>
          <Text style={styles.resultsButtonText}>View Results</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>DISCOVER</Text>
        <Text style={styles.subtitle}>
          {remainingCount} of 10 activities remaining
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentIndex) / activities.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex} / {activities.length}
        </Text>
      </View>

      {/* Activity Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }],
              opacity,
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.activityEmoji}>{currentActivity.emoji}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentActivity.category}</Text>
            </View>
          </View>

          <Text style={styles.activityTitle}>{currentActivity.title}</Text>
          <Text style={styles.activityDescription}>{currentActivity.description}</Text>

          <View style={styles.activityDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>⏰ Duration</Text>
              <Text style={styles.detailValue}>{currentActivity.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>💰 Cost</Text>
              <Text style={styles.detailValue}>{currentActivity.cost}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Show next card behind current one */}
        {currentIndex + 1 < activities.length && (
          <View style={[styles.card, styles.nextCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.activityEmoji}>{activities[currentIndex + 1].emoji}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{activities[currentIndex + 1].category}</Text>
              </View>
            </View>
            <Text style={styles.activityTitle}>{activities[currentIndex + 1].title}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Text style={styles.passButtonText}>×</Text>
          <Text style={styles.buttonLabel}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.likeButtonText}>✓</Text>
          <Text style={styles.buttonLabel}>Like</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{likedActivities.length}</Text>
          <Text style={styles.statLabel}>Liked</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{passedActivities.length}</Text>
          <Text style={styles.statLabel}>Passed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '400',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 0,
    marginRight: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 0,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#000000',
    position: 'absolute',
    top: 0,
  },
  nextCard: {
    opacity: 0.3,
    transform: [{ scale: 0.95 }],
    zIndex: -1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activityEmoji: {
    fontSize: 48,
  },
  categoryBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
  },
  categoryText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  activityDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  activityDetails: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  passButton: {
    width: 80,
    height: 80,
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  likeButton: {
    width: 80,
    height: 80,
    borderRadius: 0,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  passButtonText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000000',
  },
  likeButtonText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000000',
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completedTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -1,
  },
  completedSubtitle: {
    fontSize: 20,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '400',
  },
  resultsButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#000000',
  },
  resultsButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});