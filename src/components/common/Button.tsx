import React, { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES, TOUCH_TARGET, ELEVATION } from '../../theme';
import { haptics } from '../../services/haptics/haptics';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const variantColors = {
    primary: { bg: COLORS.primary, text: 'white' },
    secondary: { bg: COLORS.card, text: COLORS.text },
    success: { bg: COLORS.success, text: 'white' },
    danger: { bg: COLORS.danger, text: 'white' },
    admin: { bg: COLORS.admin, text: 'white' },
  };

  const sizes = {
    sm: { padding: SPACING.sm, minHeight: 40 },
    md: { padding: SPACING.md, minHeight: TOUCH_TARGET.min },
    lg: { padding: SPACING.lg, minHeight: 56 },
  };

  const colors = variantColors[variant];
  const sizeStyle = sizes[size];

  const computedStyle = {
    ...sizeStyle,
    backgroundColor: disabled ? COLORS.border : colors.bg,
    borderRadius: RADIUS.lg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    minHeight: sizeStyle.minHeight,
    ...(variant === 'secondary' && {
      borderWidth: 1.5,
      borderColor: disabled ? COLORS.border : COLORS.text,
    }),
    ...(disabled && { opacity: 0.5 }),
  };

  const handlePress = useCallback(async () => {
    // Trigger haptic feedback
    await haptics.tap();
    // Call the parent onPress handler
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.button, computedStyle, style]}
      testID={testID}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
    >
      <Text
        style={[
          styles.label,
          TEXT_STYLES.button,
          {
            color: disabled
              ? COLORS.textLight
              : variant === 'secondary'
                ? COLORS.text
                : colors.text,
          },
        ]}
      >
        {loading ? 'Loading...' : label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },
  label: {
    fontWeight: '800',
  },
});
