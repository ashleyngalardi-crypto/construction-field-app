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
import { Input } from '../../components/common/Input';

interface AdminLoginScreenProps {
  onSubmit: (email: string, password: string) => void;
  onBack: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onSubmit,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      onSubmit(email, password);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = email && password && isValidEmail(email) && password.length >= 6;

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
          <Text style={[styles.title, TEXT_STYLES.h2]}>Admin Login</Text>
          <View style={styles.backButton} />
        </View>

        {/* Description */}
        <Text style={[styles.subtitle, TEXT_STYLES.body14]}>
          Sign in with your email and password
        </Text>

        {/* Email Input */}
        <View style={styles.inputSection}>
          <Input
            label="Email Address"
            placeholder="admin@company.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError('');
            }}
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputSection}>
          <View style={styles.passwordLabelRow}>
            <Text style={[styles.label, TEXT_STYLES.label]}>Password</Text>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.togglePassword, TEXT_STYLES.label]}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError('');
              }}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Error Message */}
        {error ? (
          <Text style={[styles.errorText, TEXT_STYLES.body12]}>{error}</Text>
        ) : null}

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPasswordLink}>
          <Text style={[styles.forgotPasswordText, TEXT_STYLES.label]}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>👔</Text>
          <Text style={[styles.infoText, TEXT_STYLES.body12]}>
            Admin access only. Contact your IT administrator for account setup.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.footer}>
        <Button
          label="Sign In"
          variant="admin"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isValid || isLoading}
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
  inputSection: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  togglePassword: {
    color: COLORS.primary,
  },
  passwordInputWrapper: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  passwordInput: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: 'DMSans-Regular',
    padding: 0,
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: SPACING.md,
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    color: COLORS.primary,
  },
  infoBox: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.adminLight,
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
