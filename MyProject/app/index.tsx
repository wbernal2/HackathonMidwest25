import { Platform, StyleSheet, TouchableOpacity, Alert, View, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleCreateHangout = () => {
    router.push('/(tabs)/create-session');
  };

  const handleJoinHangout = () => {
    Alert.alert('Join Hangout', 'Enter invite code to join!');
    // TODO: Navigate to join session screen
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.appTitle}>HANGHUB</Text>
        <Text style={styles.subtitle}>The future of hangout planning</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateHangout}>
          <Text style={styles.primaryButtonText}>CREATE SESSION</Text>
          <Text style={styles.buttonSubtext}>Start something new</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleJoinHangout}>
          <Text style={styles.secondaryButtonText}>JOIN SESSION</Text>
        </TouchableOpacity>
      </View>

      {/* How it Works */}
      <View style={styles.howItWorksContainer}>
        <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
        <View style={styles.stepContainer}>
          <Text style={styles.step}>Create session & invite friends</Text>
          <Text style={styles.step}>Swipe through activity suggestions</Text>
          <Text style={styles.step}>Match on what everyone likes</Text>
          <Text style={styles.step}>Make it happen</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appTitle: {
    fontSize: 42,
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
  actionContainer: {
    gap: 20,
    marginBottom: 60,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: '#000000',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  buttonSubtext: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  secondaryButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  howItWorksContainer: {
    backgroundColor: '#F8F8F8',
    padding: 24,
    borderRadius: 8,
    borderWidth: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    color: '#000000',
    letterSpacing: -0.5,
  },
  stepContainer: {
    gap: 12,
  },
  step: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
    fontWeight: '500',
    lineHeight: 22,
  },
});
