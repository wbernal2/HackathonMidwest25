import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Mock data for room participants
const mockParticipants = [
  { id: '1', name: 'You', status: 'ready', isHost: true },
  { id: '2', name: 'Sarah M.', status: 'joining', isHost: false },
  { id: '3', name: 'Mike T.', status: 'ready', isHost: false },
];

export default function HangoutRoom() {
  const router = useRouter();
  const [participants, setParticipants] = useState(mockParticipants);
  const [roomCode] = useState('HG7429');

  const handleSetPreferences = () => {
    router.push('/set-preferences');
  };

  const handleInviteMore = () => {
    router.push('/invite-friends');
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Hangout Room</Text>
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeLabel}>Room Code:</Text>
          <Text style={styles.roomCode}>{roomCode}</Text>
        </View>
      </View>

      {/* Participants Section */}
      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>Who's In ({participants.length})</Text>
        
        <ScrollView style={styles.participantsList}>
          {participants.map((participant) => (
            <View key={participant.id} style={styles.participantCard}>
              <View style={styles.participantInfo}>
                <Text style={styles.participantName}>
                  {participant.name}
                  {participant.isHost && <Text style={styles.hostBadge}> (Host)</Text>}
                </Text>
                <Text style={[
                  styles.status,
                  participant.status === 'ready' ? styles.statusReady : styles.statusJoining
                ]}>
                  {participant.status === 'ready' ? '✓ Ready' : '⏳ Joining...'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.inviteButton}
          onPress={handleInviteMore}
        >
          <Text style={styles.inviteButtonText}>+ Invite More Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleSetPreferences}
        >
          <Text style={styles.continueButtonText}>Set My Preferences</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Everyone will set their preferences, then we'll find activities you all love!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 15,
    letterSpacing: -1,
  },
  roomCodeContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomCodeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 10,
  },
  roomCode: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 2,
  },
  participantsSection: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  participantsList: {
    flex: 1,
  },
  participantCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  participantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  hostBadge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusReady: {
    color: '#4CAF50',
  },
  statusJoining: {
    color: '#FF9800',
  },
  actionsSection: {
    marginBottom: 20,
  },
  inviteButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  inviteButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  continueButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
  },
  infoSection: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
});