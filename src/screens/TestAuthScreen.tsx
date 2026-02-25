import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { auth } from '../services/firebase';

export const TestAuthScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+1555555');
  const [message, setMessage] = useState('Firebase Test Screen\n\nClick button to test');
  const [loading, setLoading] = useState(false);

  const testButtonClick = () => {
    console.log('[TestAuth] Button clicked!');
    setMessage('✅ Button works!\n\n' + new Date().toLocaleTimeString());
    Alert.alert('Button Works', 'Your button is responsive!');
  };

  const testFirebaseAuth = async () => {
    console.log('[TestAuth] Testing Firebase Auth...');
    setLoading(true);
    setMessage('Testing Firebase....');

    try {
      const { signInWithPhoneNumber, RecaptchaVerifier } = await import('firebase/auth');
      console.log('[TestAuth] Firebase auth functions imported');

      setMessage('✅ Firebase loaded!\n\nPhone: ' + phoneNumber);
      setLoading(false);
    } catch (error: any) {
      console.error('[TestAuth] Error:', error);
      setMessage('❌ Error loading Firebase:\n\n' + error.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔥 Firebase Test</Text>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 555 555 0123"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testButtonClick}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'Test Button'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryBtn, loading && styles.buttonDisabled]}
            onPress={testFirebaseAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Testing...' : 'Test Firebase'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Status:</Text>
          <Text style={styles.infoText}>✅ App Loaded</Text>
          <Text style={styles.infoText}>✅ Firebase Config Ready</Text>
          <Text style={styles.infoText}>🔧 Testing Phase</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a73e8',
    textAlign: 'center',
  },
  messageBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  messageText: {
    color: '#1565c0',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a73e8',
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryBtn: {
    backgroundColor: '#34a853',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8,
    fontSize: 14,
  },
  infoText: {
    color: '#5f6368',
    fontSize: 14,
    marginBottom: 4,
  },
});
