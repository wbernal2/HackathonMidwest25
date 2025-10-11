import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import RoomAPI from '../services/RoomAPI';

export default function JoinRoomScreen() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      Alert.alert('Error', 'Please enter a room code');
      return;
    }
    if (!userName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsJoining(true);

    try {
      const result = await RoomAPI.joinRoom(roomCode.trim().toUpperCase(), userName.trim());

      if (result.success && result.participant) {
        console.log('Successfully joined room:', roomCode.toUpperCase());
        
        // Navigate to hangout room with participant info
        router.push({
          pathname: '/hangout-room',
          params: { 
            roomCode: roomCode.trim().toUpperCase(),
            participantName: userName.trim(),
            participantId: result.participant.id,
            isHost: 'false'
          }
        });
      } else {
        Alert.alert('Error', result.message || 'Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      Alert.alert('Error', 'Network error - could not join room');
    } finally {
      setIsJoining(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const formatRoomCode = (text: string) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const formatted = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    // Limit to 6 characters (typical room code length)
    return formatted.slice(0, 6);
  };

  const handleRoomCodeChange = (text: string) => {
    const formatted = formatRoomCode(text);
    setRoomCode(formatted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>JOIN ROOM</Text>
          <Text style={styles.subtitle}>Enter the room code to join the hangout</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="What should we call you?"
              placeholderTextColor="#999"
              maxLength={20}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Room Code</Text>
            <TextInput
              style={[styles.input, styles.roomCodeInput]}
              value={roomCode}
              onChangeText={handleRoomCodeChange}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#999"
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.roomCodeHelper}>
              Ask the host for the room code (e.g., HG7429)
            </Text>
          </View>

          {/* Mock Room Codes for Testing */}
          <View style={styles.testCodesContainer}>
            <Text style={styles.testCodesTitle}>Quick Join (Demo)</Text>
            <View style={styles.testCodesRow}>
              {['HG7429', 'FUN123', 'MEET42'].map((code) => (
                <TouchableOpacity
                  key={code}
                  style={styles.testCodeButton}
                  onPress={() => setRoomCode(code)}
                >
                  <Text style={styles.testCodeText}>{code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Join Button */}
        <TouchableOpacity 
          style={[
            styles.joinButton,
            ((!roomCode.trim() || !userName.trim()) || isJoining) && styles.joinButtonDisabled
          ]}
          onPress={handleJoinRoom}
          disabled={(!roomCode.trim() || !userName.trim()) || isJoining}
        >
          <Text style={[
            styles.joinButtonText,
            ((!roomCode.trim() || !userName.trim()) || isJoining) && styles.joinButtonTextDisabled
          ]}>
            {isJoining ? 'Joining Room...' : 'Join Hangout'}
          </Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • You'll join the hangout room{'\n'}
            • Set your preferences for activities{'\n'}
            • Swipe through suggestions with the group{'\n'}
            • Match on activities everyone loves!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
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
    fontWeight: '400',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 20,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    fontWeight: '500',
  },
  roomCodeInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFD700',
  },
  roomCodeHelper: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  testCodesContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  testCodesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },
  testCodesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  testCodeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    flex: 1,
    alignItems: 'center',
  },
  testCodeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  joinButton: {
    backgroundColor: '#FFD700',
    padding: 24,
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 30,
  },
  joinButtonDisabled: {
    backgroundColor: '#E0E0E0',
    borderColor: '#CCCCCC',
  },
  joinButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  joinButtonTextDisabled: {
    color: '#999999',
  },
  infoContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    fontWeight: '500',
  },
});