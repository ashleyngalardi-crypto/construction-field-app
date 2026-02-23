import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { NumPad } from '../../components/common/NumPad';
import { PinDots } from '../../components/common/PinDots';

interface PinLockScreenProps {
  userName?: string;
  onUnlock: (pin: string) => void;
  onBiometric?: () => void;
  biometricAvailable?: boolean;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  userName = 'User',
  onUnlock,
  onBiometric,
  biometricAvailable = false,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;

  // Auto-check PIN when it reaches 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      // Small delay for UX
      const timer = setTimeout(() => {
        onUnlock(pin);
        // Reset after 300ms to prepare for potential re-entry
        setTimeout(() => {
          setPin('');
        }, 300);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pin, onUnlock]);

  const handleNumPadPress = (num: number) => {
    setError('');
    setShakeError(false);

    if (attempts >= MAX_ATTEMPTS) {
      setError('Too many failed attempts. Please try again later.');
      return;
    }

    if (pin.length < 4) {
      setPin(pin + num.toString());
    }
  };

  const handleDelete = () => {
    setError('');
    setShakeError(false);

    if (attempts >= MAX_ATTEMPTS) {
      return;
    }

    setPin(pin.slice(0, -1));
  };

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setShakeError(true);

    if (newAttempts >= MAX_ATTEMPTS) {
      setError('Too many failed attempts. Please try again later.');
    } else {
      setError(`Incorrect PIN. ${MAX_ATTEMPTS - newAttempts} attempts remaining`);
    }

    setPin('');
  };

  // This would be called from parent component when PIN verification fails
  // For now, it's set up to be wired into the auth flow
  const handleError = () => {
    handleFailedAttempt();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, TEXT_STYLES.h3]}>Welcome back</Text>
        <Text style={[styles.userName, TEXT_STYLES.h2]}>{userName}</Text>
      </View>

      {/* Avatar/Icon */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      </View>

      {/* PIN Instructions */}
      <Text style={[styles.instruction, TEXT_STYLES.body14]}>
        Enter your PIN to unlock
      </Text>

      {/* PIN Display */}
      <View style={styles.pinContainer}>
        <PinDots length={4} filled={pin.length} error={shakeError} />
      </View>

      {/* Error Message */}
      {error ? (
        <Text
          style={[
            styles.errorText,
            TEXT_STYLES.body12,
            attempts >= MAX_ATTEMPTS && styles.errorTextCritical,
          ]}
        >
          {error}
        </Text>
      ) : null}

      {/* Biometric Button */}
      {biometricAvailable && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={() => onBiometric?.()}
          disabled={attempts >= MAX_ATTEMPTS}
        >
          <Text style={styles.biometricIcon}>👆</Text>
          <Text style={[styles.biometricText, TEXT_STYLES.label]}>
            Use Face ID
          </Text>
        </TouchableOpacity>
      )}

      {/* NumPad */}
      <NumPad
        onPress={handleNumPadPress}
        onDelete={handleDelete}
        showBiometric={biometricAvailable}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  greeting: {
    color: COLORS.textMid,
    marginBottom: SPACING.xs,
  },
  userName: {
    color: COLORS.text,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarText: {
    fontSize: 40,
  },
  instruction: {
    textAlign: 'center',
    color: COLORS.textMid,
    marginBottom: SPACING.lg,
  },
  pinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    minHeight: 60,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  errorTextCritical: {
    fontWeight: '600',
  },
  biometricButton: {
    marginVertical: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  biometricIcon: {
    fontSize: 24,
  },
  biometricText: {
    color: COLORS.primary,
  },
});
