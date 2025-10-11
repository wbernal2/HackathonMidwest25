import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function CreateSessionScreen() {
  const [hangoutName, setHangoutName] = useState('');
  const [location, setLocation] = useState('');
  const [dateText, setDateText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [groupSize, setGroupSize] = useState('4');

  const handleContinue = () => {
    // Navigate to invite friends screen
    console.log('Session created:', { hangoutName, location, dateText, timeText, groupSize });
    // router.push('/invite-friends'); // Will implement navigation later
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>CREATE SESSION</Text>
        <Text style={styles.subtitle}>Set the foundation</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hangout Name</Text>
            <TextInput
              style={styles.input}
              value={hangoutName}
              onChangeText={setHangoutName}
              placeholder="What should we call this hangout?"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Where are you planning to meet?"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeGroup}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={dateText}
                onChangeText={setDateText}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.dateTimeGroup}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                value={timeText}
                onChangeText={setTimeText}
                placeholder="HH:MM AM/PM"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Group Size</Text>
            <View style={styles.groupSizeContainer}>
              {['2', '3', '4', '5', '6+'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.groupSizeOption,
                    groupSize === size && styles.groupSizeSelected
                  ]}
                  onPress={() => setGroupSize(size)}
                >
                  <Text style={[
                    styles.groupSizeText,
                    groupSize === size && styles.groupSizeTextSelected
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Next Step</Text>
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
    padding: 24,
    paddingTop: 80,
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
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
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
  dateTimeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  dateTimeGroup: {
    flex: 1,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  groupSizeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  groupSizeOption: {
    flex: 1,
    padding: 18,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  groupSizeSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#000000',
  },
  groupSizeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  groupSizeTextSelected: {
    color: '#000000',
  },
  continueButton: {
    backgroundColor: '#FFD700',
    padding: 24,
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});