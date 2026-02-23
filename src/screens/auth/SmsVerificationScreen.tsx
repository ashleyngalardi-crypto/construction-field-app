import React, { useState, useRef } from 'react';
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

interface SmsVerificationScreenProps {
  phoneNumber: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
}

export const SmsVerificationScreen: React.FC<SmsVerificationScreenProps> = ({
  phoneNumber,
  onSubmit,
  onBack,
  onResend,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    setError('');

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Get only the last character (handles paste and typing)
    const newChar = value.slice(-1);
    const newCode = [...code];
    newCode[index] = newChar;
    setCode(newCode);

    // Auto-advance to next field if digit entered
    if (newChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (newChar && newCode.every((digit) => digit !== '')) {
      handleSubmit(newCode);
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    // Handle backspace - move to previous field
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (codeArray = code) => {
    const fullCode = codeArray.join('');

    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      onSubmit(fullCode);
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setError('');
    setCode(['', '', '', '', '', '']);
    setResendTimer(30);
    onResend();

    // Countdown timer
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isFilled = code.every((digit) => digit !== '');

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
          <Text style={[styles.title, TEXT_STYLES.h2]}>Verify Code</Text>
          <View style={styles.backButton} />
        </View>

        {/* Description */}
        <Text style={[styles.subtitle, TEXT_STYLES.body14]}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
        </Text>

        {/* Code Input Fields */}
        <View style={styles.codeInputContainer}>
          <View style={styles.codeInputs}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled,
                  error && styles.codeInputError,
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e)}
                keyboardType="number-pad"
                maxLength={1}
                editable={!isLoading}
                selectTextOnFocus
              />
            ))}
          </View>

          {error ? (
            <Text style={[styles.errorText, TEXT_STYLES.body12]}>{error}</Text>
          ) : null}
        </View>

        {/* Resend section */}
        <View style={styles.resendSection}>
          <Text style={[styles.resendLabel, TEXT_STYLES.body12]}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendTimer > 0 || isLoading}
          >
            <Text
              style={[
                styles.resendLink,
                TEXT_STYLES.label,
                (resendTimer > 0 || isLoading) && styles.resendLinkDisabled,
              ]}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.footer}>
        <Button
          label="Verify"
          variant="primary"
          onPress={() => handleSubmit()}
          loading={isLoading}
          disabled={!isFilled || isLoading}
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
    textAlign: 'center',
  },
  phoneHighlight: {
    color: COLORS.text,
    fontFamily: 'DMSans-Bold',
  },
  codeInputContainer: {
    marginBottom: SPACING.xl,
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  codeInput: {
    width: 52,
    height: 64,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
  },
  codeInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  codeInputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.bg,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  resendSection: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resendLabel: {
    color: COLORS.textMid,
    textAlign: 'center',
  },
  resendLink: {
    color: COLORS.primary,
  },
  resendLinkDisabled: {
    color: COLORS.textLight,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.lg + (Platform.OS === 'ios' ? SPACING.md : 0),
  },
});
