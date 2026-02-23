import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../theme';

interface PinDotsProps {
  length: number;
  filled: number;
  error?: boolean;
  success?: boolean;
}

export const PinDots: React.FC<PinDotsProps> = ({
  length,
  filled,
  error = false,
  success = false,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      // Trigger shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const getDotColor = (index: number) => {
    if (index < filled) {
      if (error) return COLORS.danger;
      if (success) return COLORS.success;
      return COLORS.primary;
    }
    return COLORS.border;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: shakeAnim }],
        },
      ]}
    >
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i < filled ? getDotColor(i) : 'transparent',
              borderColor: getDotColor(i),
            },
          ]}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
  },
});
