import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS, ELEVATION } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'subtle' | 'medium' | 'high';
  padding?: keyof typeof SPACING;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'subtle',
  padding = 'md',
}) => {
  const elevationStyle = ELEVATION[elevation];
  const paddingValue = SPACING[padding];

  return (
    <View
      style={[
        styles.card,
        {
          padding: paddingValue,
          ...elevationStyle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
