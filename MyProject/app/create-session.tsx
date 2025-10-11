import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateSessionScreen() {
  const router = useRouter();
  const [hangoutName, setHangoutName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const [pendingTime, setPendingTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [groupSize, setGroupSize] = useState('4');

  const handleDateChange = (event: any, date?: Date) => {
    // For iOS (spinner) we update the pendingDate and wait for the user to press Done.
    // For Android the picker generally returns an event.type === 'set' or 'dismissed'.
    if (Platform.OS === 'android') {
      if (event?.type === 'dismissed') {
        // user dismissed the native dialog
        setShowDatePicker(false);
        return;
      }
      if (event?.type === 'set') {
        // Android dialog confirmed selection — commit immediately.
        if (date) {
          setSelectedDate(date);
        }
        setShowDatePicker(false);
        setPendingDate(null);
        return;
      }
    }

    // Default behavior (iOS): store in pendingDate and wait for Done.
    if (date) {
      setPendingDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    // Android returns event.type === 'set' or 'dismissed'. Handle accordingly.
    if (Platform.OS === 'android') {
      if (event?.type === 'dismissed') {
        setShowTimePicker(false);
        return;
      }
      if (event?.type === 'set') {
        if (time) {
          setSelectedTime(time);
        }
        setShowTimePicker(false);
        setPendingTime(null);
        return;
      }
    }

    // iOS spinner: update pendingTime and wait for Done
    if (time) {
      setPendingTime(time);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleContinue = () => {
    if (hangoutName.trim() && location.trim()) {
      console.log('Session created:', {
        name: hangoutName,
        location,
        date: selectedDate,
        time: selectedTime,
        groupSize
      });
      router.push('/hangout-room');
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <>
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
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => { setPendingDate(selectedDate); setShowDatePicker(true); }}
                >
                  <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateTimeGroup}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => { setPendingTime(selectedTime); setShowTimePicker(true); }}
                >
                  <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
                </TouchableOpacity>
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

      {/* Centered Date Picker Modal */}
      {showDatePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.centeredPickerContainer}>
            <Text style={styles.pickerTitle}>Select Date</Text>
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={pendingDate ?? selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={styles.picker}
                textColor="#000000"
                accentColor="#FFD700"
              />
            </View>
            <TouchableOpacity 
              style={styles.pickerDoneButton}
              onPress={() => {
                if (pendingDate) {
                  setSelectedDate(pendingDate);
                  setPendingDate(null);
                }
                setShowDatePicker(false);
              }}
            >
              <Text style={styles.pickerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Centered Time Picker Modal */}
      {showTimePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.centeredPickerContainer}>
            <Text style={styles.pickerTitle}>Select Time</Text>
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={pendingTime ?? selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                style={styles.picker}
                textColor="#000000"
                accentColor="#FFD700"
              />
            </View>
            <TouchableOpacity 
              style={styles.pickerDoneButton}
              onPress={() => {
                if (pendingTime) {
                  setSelectedTime(pendingTime);
                  setPendingTime(null);
                }
                setShowTimePicker(false);
              }}
            >
              <Text style={styles.pickerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
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
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
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
  // Modal and Picker Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  centeredPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    borderWidth: 3,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minWidth: 300,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    height: 200,
  },
  pickerDoneButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#000000',
  },
  pickerDoneText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
});