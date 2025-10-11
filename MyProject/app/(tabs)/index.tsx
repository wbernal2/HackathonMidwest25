import { Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleCreateHangout = () => {
    router.push('/create-session');
  };

  const handleJoinHangout = () => {
    Alert.alert('Join Hangout', 'Enter invite code to join!');
    // TODO: Navigate to join session screen
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title" style={styles.appTitle}>HANGHUB</ThemedText>
        <ThemedText style={styles.subtitle}>The future of hangout planning</ThemedText>
      </ThemedView>

      {/* Action Buttons */}
      <ThemedView style={styles.actionContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateHangout}>
          <ThemedText style={styles.primaryButtonText}>CREATE SESSION</ThemedText>
          <ThemedText style={styles.buttonSubtext}>Start something new</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleJoinHangout}>
          <ThemedText style={styles.secondaryButtonText}>JOIN SESSION</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* How it Works */}
      <ThemedView style={styles.howItWorksContainer}>
        <ThemedText style={styles.sectionTitle}>HOW IT WORKS</ThemedText>
        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.step}>Create session & invite friends</ThemedText>
          <ThemedText style={styles.step}>Swipe through activity suggestions</ThemedText>
          <ThemedText style={styles.step}>Match on what everyone likes</ThemedText>
          <ThemedText style={styles.step}>Make it happen</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
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
