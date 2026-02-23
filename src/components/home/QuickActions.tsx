import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  onPhotoPress?: () => void;
  onLogPress?: () => void;
  onReportPress?: () => void;
  onPunchPress?: () => void;
}

export const QuickActions = React.memo<QuickActionsProps>(({
  onPhotoPress,
  onLogPress,
  onReportPress,
  onPunchPress,
}) => {
  const actions: QuickAction[] = [
    {
      id: 'photo',
      icon: '📷',
      label: 'Photo',
      color: '#FFF3E0',
      onPress: onPhotoPress || (() => console.log('Photo pressed')),
    },
    {
      id: 'log',
      icon: '📝',
      label: 'Log',
      color: '#E3F2FD',
      onPress: onLogPress || (() => console.log('Log pressed')),
    },
    {
      id: 'report',
      icon: '⚠️',
      label: 'Report',
      color: '#FFEBEE',
      onPress: onReportPress || (() => console.log('Report pressed')),
    },
    {
      id: 'punch',
      icon: '✅',
      label: 'Punch',
      color: '#E8F5E9',
      onPress: onPunchPress || (() => console.log('Punch pressed')),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[styles.actionButton, { backgroundColor: action.color }]}
          onPress={action.onPress}
          activeOpacity={0.7}
          accessible
          accessibilityRole="button"
          accessibilityLabel={action.label}
          accessibilityHint={`Quick action: ${action.label}`}
        >
          <Text style={styles.icon}>{action.icon}</Text>
          <Text style={[styles.label, TEXT_STYLES.body12]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
