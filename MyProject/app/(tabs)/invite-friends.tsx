import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function InviteFriendsScreen() {
  const router = useRouter();
  const [inviteCode] = useState('HANG2025'); // Generate random code in real app
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alex', invited: false },
    { id: 2, name: 'Sarah', invited: false },
    { id: 3, name: 'Mike', invited: false },
    { id: 4, name: 'Emma', invited: false },
    { id: 5, name: 'James', invited: false },
  ]);

  const handleInviteFriend = (friendId: number) => {
    setFriends(friends.map(friend => 
      friend.id === friendId 
        ? { ...friend, invited: !friend.invited }
        : friend
    ));
  };

  const handleShareLink = async () => {
    const shareLink = `Join my hangout! Use code: ${inviteCode} or click: https://hanghub.app/join/${inviteCode}`;
    
    try {
      await Share.share({
        message: shareLink,
        title: 'Join my HangHub session!',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the invite link');
    }
  };

  const handleStartHangout = () => {
    const invitedFriends = friends.filter(friend => friend.invited);
    if (invitedFriends.length === 0) {
      Alert.alert('No Friends Invited', 'Please invite at least one friend to continue!');
      return;
    }
    
    console.log('Starting hangout with:', invitedFriends);
    // router.push('/activity-swipe'); // Will implement navigation later
  };

  const invitedCount = friends.filter(friend => friend.invited).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>BUILD THE CREW</Text>
        <Text style={styles.subtitle}>Assemble your people</Text>

        {/* Invite Code Section */}
        <View style={styles.inviteCodeContainer}>
          <Text style={styles.sectionTitle}>Share Your Code</Text>
          <View style={styles.codeDisplay}>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
            <Text style={styles.shareButtonText}>Share Link</Text>
          </TouchableOpacity>
        </View>

        {/* Friends List */}
        <View style={styles.friendsContainer}>
          <Text style={styles.sectionTitle}>Quick Invite Friends</Text>
          <Text style={styles.sectionSubtitle}>Tap to invite from your contacts</Text>
          
          <View style={styles.friendsList}>
            {friends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.friendItem,
                  friend.invited && styles.friendItemInvited
                ]}
                onPress={() => handleInviteFriend(friend.id)}
              >
                <View style={styles.friendInfo}>
                  <View style={styles.friendAvatar}>
                    <Text style={styles.friendAvatarText}>
                      {friend.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.friendName,
                    friend.invited && styles.friendNameInvited
                  ]}>
                    {friend.name}
                  </Text>
                </View>
                <View style={[
                  styles.inviteIndicator,
                  friend.invited && styles.inviteIndicatorActive
                ]}>
                  <Text style={styles.inviteIndicatorText}>
                    {friend.invited ? '✓' : '+'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {invitedCount > 0 
              ? `${invitedCount} friend${invitedCount !== 1 ? 's' : ''} invited`
              : 'No friends invited yet'
            }
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            invitedCount === 0 && styles.continueButtonDisabled
          ]} 
          onPress={handleStartHangout}
        >
          <Text style={styles.continueButtonText}>
            Begin Swiping
          </Text>
        </TouchableOpacity>

        {/* Skip Option */}
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => console.log('Skip navigation - will implement later')}
        >
          <Text style={styles.skipButtonText}>
            Skip for now (Plan Solo)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '400',
  },
  inviteCodeContainer: {
    backgroundColor: '#F8F8F8',
    padding: 24,
    borderRadius: 0,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#000000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  codeDisplay: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 0,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000000',
  },
  inviteCode: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 3,
  },
  shareButton: {
    backgroundColor: '#000000',
    padding: 18,
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  friendsContainer: {
    marginBottom: 24,
  },
  friendsList: {
    gap: 12,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  friendItemInvited: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  friendNameInvited: {
    color: '#4CAF50',
  },
  inviteIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteIndicatorActive: {
    backgroundColor: '#4CAF50',
  },
  inviteIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  continueButton: {
    backgroundColor: '#FFD700',
    padding: 24,
    borderRadius: 0,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#000000',
  },
  continueButtonDisabled: {
    backgroundColor: '#F0F0F0',
    borderColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});