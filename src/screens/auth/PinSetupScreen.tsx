import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { Button } from '../../components/common/Button';
import { NumPad } from '../../components/common/NumPad';
import { PinDots } from '../../components/common/PinDots';

type PinSetupStep = 'enter' | 'confirm';

interface PinSetupScreenProps {
  onSetup: (pin: string) => void;
  onBack: () => void;
}

export const PinSetupScreen: React.FC<PinSetupScreenProps> = ({
  onSetup,
  onBack,
}) => {
  const [step, setStep] = useState<PinSetupStep>('enter');
  const [firstPin, setFirstPin] = useState('');
  const [secondPin, setSecondPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const handleNumPadPress = (num: number) => {
    setError('');
    setShakeError(false);

    const currentPin = step === 'enter' ? firstPin : secondPin;
    const value = num.toString();

    if (currentPin.length < 4) {
      if (step === 'enter') {
        setFirstPin(currentPin + value);
      } else {
        setSecondPin(currentPin + value);
      }
    }

    // Auto-advance to confirm when first PIN is complete
    if (step === 'enter' && currentPin.length === 3) {
      setStep('confirm');
    }
  };

  const handleDelete = () => {
    setError('');
    setShakeError(false);

    if (step === 'enter') {
      setFirstPin(firstPin.slice(0, -1));
    } else {
      setSecondPin(secondPin.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (step === 'enter') {
      if (firstPin.length !== 4) {
        setError('PIN must be 4 digits');
        setShakeError(true);
        return;
      }
      setStep('confirm');
    } else {
      if (secondPin.length !== 4) {
        setError('PIN must be 4 digits');
        setShakeError(true);
        return;
      }

      if (firstPin !== secondPin) {
        setError('PINs do not match. Please try again.');
        setShakeError(true);
        setSecondPin('');
        return;
      }

      setIsLoading(true);
      try {
        onSetup(firstPin);
      } catch (err) {
        setError('An error occurred. Please try again.');
        setShakeError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('enter');
      setSecondPin('');
      setError('');
      setShakeError(false);
    } else {
      onBack();
    }
  };

  const currentPin = step === 'enter' ? firstPin : secondPin;
  const isStepComplete = currentPin.length === 4;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.title, TEXT_STYLES.h2]}>Create Your PIN</Text>
          <View style={styles.backButton} />
        </View>

        {/* Step indicator */}
        <View style={styles.stepContainer}>
          <View
            style={[styles.stepDot, step === 'enter' && styles.stepDotActive]}
          />
          <View style={styles.stepLine} />
          <View
            style={[styles.stepDot, step === 'confirm' && styles.stepDotActive]}
          />
        </View>

        {/* Description */}
        <Text style={[styles.subtitle, TEXT_STYLES.body14]}>
          {step === 'enter'
            ? 'Enter a 4-digit PIN to secure your account'
            : 'Confirm your PIN to complete setup'}
        </Text>

        {/* PIN Display */}
        <View style={styles.pinContainer}>
          <PinDots
            length={4}
            filled={currentPin.length}
            error={shakeError}
          />
        </View>

        {/* Error Message */}
        {error ? (
          <Text style={[styles.errorText, TEXT_STYLES.body12]}>{error}</Text>
        ) : null}

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🔐</Text>
          <Text style={[styles.infoText, TEXT_STYLES.body12]}>
            {step === 'enter'
              ? 'Choose a PIN you\'ll remember. You\'ll use this to unlock the app.'
              : 'Make sure you typed your PIN correctly. You\'ll need it every time you sign in.'}
          </Text>
        </View>
      </ScrollView>

      {/* NumPad */}
      <NumPad onPress={handleNumPadPress} onDelete={handleDelete} showBiometric={false} />

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          label={step === 'enter' ? 'Continue' : 'Create PIN'}
          variant="primary"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isStepComplete || isLoading}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
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
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: COLORS.border,
  },
  subtitle: {
    color: COLORS.textMid,
    marginBottom: SPACING.xl,
    lineHeight: 22,
    textAlign: 'center',
  },
  pinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    minHeight: 60,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.md,
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
