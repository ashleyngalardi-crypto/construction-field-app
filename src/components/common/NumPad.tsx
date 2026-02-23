import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES, TOUCH_TARGET } from '../../theme';

interface NumPadProps {
  onPress: (number: number) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
}

export const NumPad: React.FC<NumPadProps> = ({
  onPress,
  onDelete,
  onBiometric,
  showBiometric = false,
}) => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, showBiometric ? 'bio' : null, 0, 'del'];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {keys.map((key, index) => {
          if (key === null) {
            return <View key={`empty-${index}`} style={styles.emptySlot} />;
          }

          if (key === 'del') {
            return (
              <TouchableOpacity
                key="del"
                style={[styles.button, styles.deleteButton]}
                onPress={onDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteText}>⌫</Text>
              </TouchableOpacity>
            );
          }

          if (key === 'bio') {
            return (
              <TouchableOpacity
                key="bio"
                style={[styles.button, styles.bioButton]}
                onPress={onBiometric}
                activeOpacity={0.7}
              >
                <Text style={styles.bioIcon}>🔍</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={key}
              style={styles.button}
              onPress={() => onPress(key as number)}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, TEXT_STYLES.button]}>
                {key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    maxWidth: 280,
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: TOUCH_TARGET.min,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.textLight,
  },
  deleteText: {
    fontSize: 24,
    color: COLORS.textMid,
  },
  bioButton: {
    backgroundColor: 'transparent',
  },
  bioIcon: {
    fontSize: 24,
  },
  emptySlot: {
    width: '30%',
    aspectRatio: 1,
  },
});
