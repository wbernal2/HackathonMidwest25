import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import RoomAPI, { UserPreferences } from '../services/RoomAPI';

interface PreferenceData {
  maxDistance: number;
  budget: number;
  drivingWillingness: number;
  groupSize: number;
  timeFlexibility: number;
}

export default function SetPreferences() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get room and participant info from navigation params
  const roomCode = params.roomCode as string;
  const participantId = params.participantId as string;
  
  const [preferences, setPreferences] = useState<PreferenceData>({
    maxDistance: 10, // miles
    budget: 50, // dollars
    drivingWillingness: 5, // 1-10 scale
    groupSize: 5, // ideal group size
    timeFlexibility: 5, // 1-10 scale
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = (key: keyof PreferenceData, value: number) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleContinue = async () => {
    if (!roomCode || !participantId) {
      Alert.alert('Error', 'Missing room or participant information');
      return;
    }

    setIsLoading(true);

    try {
      // Convert preferences to match API interface
      const userPreferences: UserPreferences = {
        maxDistance: preferences.maxDistance,
        budget: preferences.budget,
        drivingWillingness: preferences.drivingWillingness,
        groupSize: preferences.groupSize,
        timeFlexibility: preferences.timeFlexibility,
      };

      const result = await RoomAPI.updatePreferences(roomCode, participantId, userPreferences);

      if (result.success) {
        console.log('Preferences saved successfully');
        router.push({
          pathname: '/activity-swipe',
          params: { roomCode, participantId }
        });
      } else {
        Alert.alert('Error', result.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBudget = (value: number) => {
    if (value === 0) return 'Free';
    if (value >= 100) return '$100+';
    return `$${value}`;
  };

  const formatDistance = (value: number) => {
    if (value >= 50) return '50+ miles';
    return `${value} miles`;
  };

  const formatScale = (value: number) => {
    if (value <= 2) return 'Low';
    if (value <= 4) return 'Medium-Low';
    if (value <= 6) return 'Medium';
    if (value <= 8) return 'Medium-High';
    return 'High';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Preferences</Text>
          <Text style={styles.subtitle}>Help us find activities everyone will love!</Text>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesContainer}>
          
          {/* Max Distance */}
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Max Distance</Text>
            <Text style={styles.preferenceValue}>{formatDistance(preferences.maxDistance)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              value={preferences.maxDistance}
              onValueChange={(value: number) => handleSliderChange('maxDistance', Math.round(value))}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#FFD700"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 mi</Text>
              <Text style={styles.sliderLabel}>50+ mi</Text>
            </View>
          </View>

          {/* Budget */}
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Budget per Person</Text>
            <Text style={styles.preferenceValue}>{formatBudget(preferences.budget)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={preferences.budget}
              onValueChange={(value: number) => handleSliderChange('budget', Math.round(value))}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#FFD700"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Free</Text>
              <Text style={styles.sliderLabel}>$100+</Text>
            </View>
          </View>

          {/* Driving Willingness */}
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Willingness to Drive</Text>
            <Text style={styles.preferenceValue}>{formatScale(preferences.drivingWillingness)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              value={preferences.drivingWillingness}
              onValueChange={(value: number) => handleSliderChange('drivingWillingness', Math.round(value))}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#FFD700"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Prefer not to</Text>
              <Text style={styles.sliderLabel}>Happy to drive</Text>
            </View>
          </View>

          {/* Ideal Group Size */}
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Ideal Group Size</Text>
            <Text style={styles.preferenceValue}>{preferences.groupSize} people</Text>
            <Slider
              style={styles.slider}
              minimumValue={2}
              maximumValue={12}
              value={preferences.groupSize}
              onValueChange={(value: number) => handleSliderChange('groupSize', Math.round(value))}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#FFD700"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>2 people</Text>
              <Text style={styles.sliderLabel}>12+ people</Text>
            </View>
          </View>

          {/* Time Flexibility */}
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Time Flexibility</Text>
            <Text style={styles.preferenceValue}>{formatScale(preferences.timeFlexibility)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              value={preferences.timeFlexibility}
              onValueChange={(value: number) => handleSliderChange('timeFlexibility', Math.round(value))}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#FFD700"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Strict schedule</Text>
              <Text style={styles.sliderLabel}>Very flexible</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, isLoading && styles.disabledButton]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Saving Preferences...' : 'Continue to Activity Swipes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 10,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  preferencesContainer: {
    paddingVertical: 20,
  },
  preferenceItem: {
    marginBottom: 40,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 25,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  preferenceLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  preferenceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    borderColor: '#999999',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
  },
});