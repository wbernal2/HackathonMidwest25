import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

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

// Mock group statistics data
const mockGroupStats: GroupStats = {
  avgDistance: 15,
  avgBudget: 35,
  avgDriving: 6.5,
  avgGroupSize: 4,
  avgTimeFlexibility: 7,
  totalLikes: 28,
  totalPasses: 12,
  commonPreferences: ['Mid-range budget', 'Willing to drive', 'Flexible timing'],
  popularActivities: [
    { name: 'Coffee Shop', likes: 8 },
    { name: 'Mini Golf', likes: 7 },
    { name: 'Movies', likes: 6 },
    { name: 'Bowling', likes: 5 },
    { name: 'Escape Room', likes: 2 }
  ]
};

const participants = [
  { name: 'You', status: 'completed' },
  { name: 'Sarah M.', status: 'completed' },
  { name: 'Mike T.', status: 'swiping' },
  { name: 'Alex R.', status: 'preferences' }
];

export default function ResultsWaitingRoom() {
  const router = useRouter();
  const [showStats, setShowStats] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  const completedCount = participants.filter(p => p.status === 'completed').length;
  const totalCount = participants.length;

  const handleViewResults = () => {
    router.push('/match-results');
  };

  const renderProgressBar = (value: number, max: number, color: string) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
    </View>
  );

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

        {/* Participants Status */}
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          {participants.map((participant, index) => (
            <View key={index} style={styles.participantStatus}>
              <Text style={styles.participantName}>{participant.name}</Text>
              <View style={[
                styles.statusBadge,
                participant.status === 'completed' && styles.statusCompleted,
                participant.status === 'swiping' && styles.statusSwiping,
                participant.status === 'preferences' && styles.statusPreferences
              ]}>
                <Text style={[
                  styles.statusText,
                  participant.status === 'completed' && styles.statusTextCompleted
                ]}>
                  {participant.status === 'completed' && '✓ Done'}
                  {participant.status === 'swiping' && '⏳ Swiping'}
                  {participant.status === 'preferences' && '⚙️ Preferences'}
                </Text>
              </View>
            </View>
          ))}
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
                  <Text style={styles.statValue}>{mockGroupStats.totalLikes}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Average Budget</Text>
                  <Text style={styles.statValue}>${mockGroupStats.avgBudget}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Max Distance</Text>
                  <Text style={styles.statValue}>{mockGroupStats.avgDistance} mi</Text>
                </View>
              </View>
            )}

            {/* Preferences Tab */}
            {selectedTab === 'preferences' && (
              <View style={styles.tabContent}>
                <Text style={styles.chartTitle}>Common Preferences</Text>
                {mockGroupStats.commonPreferences.map((pref, index) => (
                  <View key={index} style={styles.preferenceItem}>
                    <Text style={styles.preferenceText}>• {pref}</Text>
                  </View>
                ))}
                
                <Text style={styles.chartTitle}>Group Averages</Text>
                <View style={styles.chartItem}>
                  <Text style={styles.chartLabel}>Driving Willingness</Text>
                  {renderProgressBar(mockGroupStats.avgDriving, 10, '#4CAF50')}
                  <Text style={styles.chartValue}>{mockGroupStats.avgDriving}/10</Text>
                </View>
                <View style={styles.chartItem}>
                  <Text style={styles.chartLabel}>Time Flexibility</Text>
                  {renderProgressBar(mockGroupStats.avgTimeFlexibility, 10, '#2196F3')}
                  <Text style={styles.chartValue}>{mockGroupStats.avgTimeFlexibility}/10</Text>
                </View>
              </View>
            )}

            {/* Activities Tab */}
            {selectedTab === 'activities' && (
              <View style={styles.tabContent}>
                <Text style={styles.chartTitle}>Most Popular Activities</Text>
                {mockGroupStats.popularActivities.map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <View style={styles.activityBarContainer}>
                      {renderProgressBar(activity.likes, totalCount, '#FFD700')}
                      <Text style={styles.activityValue}>{activity.likes}/{totalCount}</Text>
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
});