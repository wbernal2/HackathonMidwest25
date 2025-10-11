import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RoomAPI, { RoomStats } from '../services/RoomAPI';

const { width } = Dimensions.get('window');

interface GroupStats {
  avgDistance: number;
  avgBudget: number;
  avgDriving: number;
  avgGroupSize: number;
  avgTimeFlexibility: number;
  totalLikes: number;
  totalPasses: number;
  commonPreferences: string[];
  popularActivities: { name: string; likes: number }[];
}





export default function ResultsWaitingRoom() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get room and participant info from navigation params
  const roomCode = params.roomCode as string;
  const participantId = params.participantId as string;
  
  const [showStats, setShowStats] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch room statistics
  useEffect(() => {
    if (!roomCode) {
      setError('Room code not provided');
      setIsLoading(false);
      return;
    }

    const fetchRoomStats = async () => {
      try {
        const result = await RoomAPI.getRoomStats(roomCode);
        if (result.success && result.stats) {
          setRoomStats(result.stats);
        } else {
          setError(result.message || 'Failed to load room statistics');
        }
      } catch (error) {
        console.error('Error fetching room stats:', error);
        setError('Failed to load room statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomStats();
  }, [roomCode]);

  // Calculate progress based on room stats
  const completedCount = roomStats?.completedParticipants || 0;
  const totalCount = roomStats?.participantCount || 0;

  const handleViewResults = () => {
    // Navigate back to home after viewing results
    router.push('/');
  };

  const renderProgressBar = (value: number, max: number, color: string) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading room statistics...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Waiting for Everyone</Text>
          <Text style={styles.subtitle}>
            {completedCount} of {totalCount} people finished swiping
          </Text>
          {renderProgressBar(completedCount, totalCount, '#FFD700')}
        </View>

        {/* Room Progress */}
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Room Progress</Text>
          <View style={styles.participantStatus}>
            <Text style={styles.participantName}>Participants Completed</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {completedCount} / {totalCount}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[
              styles.progressBar, 
              { 
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`, 
                backgroundColor: '#4CAF50' 
              }
            ]} />
          </View>
        </View>

        {/* Stats Toggle */}
        <TouchableOpacity 
          style={styles.statsToggle}
          onPress={() => setShowStats(!showStats)}
        >
          <Text style={styles.statsToggleText}>
            {showStats ? '▼ Hide Group Stats' : '▶ Show Group Stats'}
          </Text>
        </TouchableOpacity>

        {/* Group Statistics */}
        {showStats && (
          <View style={styles.statsContainer}>
            
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
                onPress={() => setSelectedTab('overview')}
              >
                <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
                  Overview
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'preferences' && styles.activeTab]}
                onPress={() => setSelectedTab('preferences')}
              >
                <Text style={[styles.tabText, selectedTab === 'preferences' && styles.activeTabText]}>
                  Preferences
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'activities' && styles.activeTab]}
                onPress={() => setSelectedTab('activities')}
              >
                <Text style={[styles.tabText, selectedTab === 'activities' && styles.activeTabText]}>
                  Activities
                </Text>
              </TouchableOpacity>
            </View>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <View style={styles.tabContent}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Group Compatibility</Text>
                  <Text style={styles.statValue}>87%</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Activity Likes</Text>
                  <Text style={styles.statValue}>{roomStats?.activityStats.totalLikes || 0}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Average Budget</Text>
                  <Text style={styles.statValue}>${Math.round(roomStats?.averagePreferences.budget || 0)}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Max Distance</Text>
                  <Text style={styles.statValue}>{Math.round(roomStats?.averagePreferences.maxDistance || 0)} mi</Text>
                </View>
              </View>
            )}

            {/* Preferences Tab */}
            {selectedTab === 'preferences' && (
              <View style={styles.tabContent}>
                <Text style={styles.chartTitle}>Common Preferences</Text>
                {['Budget-friendly', 'Close Distance', 'Flexible Timing'].map((pref, index) => (
                  <View key={index} style={styles.preferenceItem}>
                    <Text style={styles.preferenceText}>• {pref}</Text>
                  </View>
                ))}
                
                <Text style={styles.chartTitle}>Group Averages</Text>
                <View style={styles.chartItem}>
                  <Text style={styles.chartLabel}>Driving Willingness</Text>
                  {renderProgressBar(Math.round(roomStats?.averagePreferences.drivingWillingness || 0), 10, '#4CAF50')}
                  <Text style={styles.chartValue}>{Math.round(roomStats?.averagePreferences.drivingWillingness || 0)}/10</Text>
                </View>
                <View style={styles.chartItem}>
                  <Text style={styles.chartLabel}>Time Flexibility</Text>
                  {renderProgressBar(Math.round(roomStats?.averagePreferences.timeFlexibility || 0), 10, '#2196F3')}
                  <Text style={styles.chartValue}>{Math.round(roomStats?.averagePreferences.timeFlexibility || 0)}/10</Text>
                </View>
              </View>
            )}

            {/* Activities Tab */}
            {selectedTab === 'activities' && (
              <View style={styles.tabContent}>
                <Text style={styles.chartTitle}>Most Popular Activities</Text>
                {Object.entries(roomStats?.activityStats.popularActivities || {}).slice(0, 5).map(([activityName, likes], index) => (
                  <View key={index} style={styles.activityItem}>
                    <Text style={styles.activityName}>{activityName}</Text>
                    <View style={styles.activityBarContainer}>
                      {renderProgressBar(likes as number, totalCount || 1, '#FFD700')}
                      <Text style={styles.activityValue}>{likes}/{totalCount || 1}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* Bottom Action */}
      {completedCount === totalCount && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.viewResultsButton}
            onPress={handleViewResults}
          >
            <Text style={styles.viewResultsButtonText}>View Matches & Plan Hangout!</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontWeight: '600',
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  participantsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  participantStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  participantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusSwiping: {
    backgroundColor: '#FF9800',
  },
  statusPreferences: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  statusTextCompleted: {
    color: '#FFFFFF',
  },
  statsToggle: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000000',
  },
  statsToggleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  statsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '700',
  },
  tabContent: {
    minHeight: 200,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 15,
    marginTop: 10,
  },
  preferenceItem: {
    paddingVertical: 8,
  },
  preferenceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  chartItem: {
    marginBottom: 20,
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  chartValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'right',
    marginTop: 5,
  },
  activityItem: {
    marginBottom: 15,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  activityBarContainer: {
    position: 'relative',
  },
  activityValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'right',
    marginTop: 5,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  viewResultsButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  viewResultsButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    marginTop: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 3,
    borderColor: '#000000',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
  },
});