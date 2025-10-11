import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RoomAPI, { Room, Participant } from '../services/RoomAPI';

export default function HangoutRoom() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roomCode, setRoomCode] = useState('');
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load room data when component mounts
  useEffect(() => {
    const loadRoom = async () => {
      const code = params.roomCode as string;
      const participantName = params.participantName as string;
      
      if (!code || !participantName) {
        Alert.alert('Error', 'Missing room information');
        router.push('/');
        return;
      }

      setRoomCode(code);
      
      try {
        const result = await RoomAPI.getRoomInfo(code);
        
        if (result.success && result.room) {
          setRoom(result.room);
          setParticipants(result.room.participants);
          
          // Find current participant
          const participant = result.room.participants.find(p => p.name === participantName);
          setCurrentParticipant(participant || null);
        } else {
          Alert.alert('Error', 'Room not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading room:', error);
        Alert.alert('Error', 'Could not load room');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoom();
  }, [params]);

  // Set up real-time polling for room updates
  useEffect(() => {
    if (!roomCode) return;

    let cleanup: (() => void) | undefined;

    const setupPolling = async () => {
      cleanup = await RoomAPI.pollRoomUpdates(roomCode, (updatedRoom) => {
        setRoom(updatedRoom);
        setParticipants(updatedRoom.participants);
        
        // Update current participant info
        const participantName = params.participantName as string;
        const participant = updatedRoom.participants.find(p => p.name === participantName);
        setCurrentParticipant(participant || null);
      });
    };

    setupPolling();

    return () => {
      if (cleanup) cleanup();
    };
  }, [roomCode, params.participantName]);

  const handleSetPreferences = () => {
    if (!currentParticipant) {
      Alert.alert('Error', 'Participant information not found');
      return;
    }
    
    router.push({
      pathname: '/set-preferences',
      params: {
        roomCode,
        participantId: currentParticipant.id,
        participantName: currentParticipant.name
      }
    });
  };

  const handleInviteMore = () => {
    router.push('/invite-friends');
  };

  const handleShareRoomCode = async () => {
    try {
      await Share.share({
        message: `Join my hangout! Use room code: ${roomCode}\n\nDownload HangHub to join the fun!`,
        title: 'Join My Hangout',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share room code');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading room...</Text>
      </View>
    );
  }

  if (!room) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Room not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Text style={styles.backButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{room.hangoutName}</Text>
        <Text style={styles.subtitle}>{room.location}</Text>
        <TouchableOpacity style={styles.roomCodeContainer} onPress={handleShareRoomCode}>
          <Text style={styles.roomCodeLabel}>Room Code:</Text>
          <Text style={styles.roomCode}>{roomCode}</Text>
          <Text style={styles.shareHint}>Tap to share</Text>
        </TouchableOpacity>
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
    marginBottom: 5,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 15,
    textAlign: 'center',
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
  shareHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginTop: 5,
    fontStyle: 'italic',
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
});