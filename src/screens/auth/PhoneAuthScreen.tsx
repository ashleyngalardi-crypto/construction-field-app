import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { Button } from '../../components/common/Button';

interface PhoneAuthScreenProps {
  onSubmit: (phoneNumber: string) => void;
  onBack: () => void;
}

export const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({ onSubmit, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numeric = value.replace(/\D/g, '');

    // Limit to 10 digits (US format)
    if (numeric.length <= 10) {
      // Format as (XXX) XXX-XXXX
      if (numeric.length <= 3) {
        return numeric;
      } else if (numeric.length <= 6) {
        return `(${numeric.slice(0, 3)}) ${numeric.slice(3)}`;
      } else {
        return `(${numeric.slice(0, 3)}) ${numeric.slice(3, 6)}-${numeric.slice(6)}`;
      }
    }

    return phoneNumber;
  };

  const handlePhoneChange = (value: string) => {
    setError('');
    setPhoneNumber(formatPhoneNumber(value));
  };

  const isValidPhone = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    return numeric.length === 10;
  };

  const handleSubmit = async () => {
    if (!isValidPhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Convert to E.164 format (+1XXXXXXXXXX)
      const numeric = phoneNumber.replace(/\D/g, '');
      const e164 = `+1${numeric}`;
      onSubmit(e164);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.title, TEXT_STYLES.h2]}>Enter Your Phone</Text>
          <View style={styles.backButton} />
        </View>

        {/* Description */}
        <Text style={[styles.subtitle, TEXT_STYLES.body14]}>
          We'll send you a verification code to confirm your phone number.
        </Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, TEXT_STYLES.label]}>Phone Number</Text>
          <View
            style={[
              styles.phoneInputWrapper,
              error ? styles.phoneInputError : undefined,
            ]}
          >
            <Text style={styles.countryCode}>🇺🇸</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="(555) 123-4567"
              placeholderTextColor={COLORS.textLight}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              editable={!isLoading}
              maxLength={14}
            />
          </View>
          {error ? (
            <Text style={[styles.errorText, TEXT_STYLES.body12]}>{error}</Text>
          ) : null}
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={[styles.infoText, TEXT_STYLES.body12]}>
            Standard SMS rates apply. You'll need this phone number to sign in.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.footer}>
        <Button
          label="Send Code"
          variant="primary"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isValidPhone(phoneNumber) || isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: {
    fontSize: 24,
    color: COLORS.text,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.textMid,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  phoneInputError: {
    borderColor: COLORS.danger,
  },
  countryCode: {
    fontSize: 20,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: 'DMSans-Regular',
    padding: 0,
  },
  errorText: {
    color: COLORS.danger,
    marginTop: SPACING.sm,
  },
  infoBox: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    lineHeight: 18,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.lg + (Platform.OS === 'ios' ? SPACING.md : 0),
  },
});
