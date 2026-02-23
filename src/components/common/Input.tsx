import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  style?: ViewStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  multiline = false,
  numberOfLines,
  error,
  style,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={style}>
      {label && (
        <Text style={[styles.label, TEXT_STYLES.label]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? COLORS.danger : isFocused ? COLORS.primary : COLORS.border,
            backgroundColor: editable ? COLORS.card : COLORS.bg,
          },
        ]}
      >
        <RNTextInput
          style={[
            styles.input,
            TEXT_STYLES.body14,
            multiline && { minHeight: numberOfLines ? numberOfLines * 20 : 100 },
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: COLORS.danger }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: SPACING.sm,
    fontWeight: '700',
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
  },
  input: {
    color: COLORS.text,
    padding: 0,
    margin: 0,
  },
  error: {
    marginTop: SPACING.xs,
    fontSize: 12,
    fontWeight: '500',
  },
});
