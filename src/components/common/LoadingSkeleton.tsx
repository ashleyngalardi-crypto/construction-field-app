import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../theme';

export type SkeletonType = 'task' | 'crewCard' | 'formField';

interface LoadingSkeletonProps {
  count?: number;
  type: SkeletonType;
  spacing?: number;
}

/**
 * Individual skeleton item component with shimmer animation
 */
const SkeletonItem: React.FC<{
  height: number;
  style?: any;
}> = ({ height, style }) => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  return (
    <Animated.View
      style={[
        {
          opacity: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          }),
        },
        style,
      ]}
    >
      <View
        style={[
          {
            height,
            backgroundColor: COLORS.border,
            borderRadius: RADIUS.md,
          },
        ]}
      />
    </Animated.View>
  );
};

/**
 * Task item skeleton
 */
const TaskSkeleton: React.FC<{ spacing: number }> = ({ spacing }) => (
  <View style={[styles.taskContainer, { marginBottom: spacing }]}>
    <SkeletonItem height={22} style={styles.taskCheckbox} />
    <View style={styles.taskContent}>
      <SkeletonItem height={16} />
      <View style={{ height: SPACING.xs }} />
      <SkeletonItem height={12} style={{ width: '60%' }} />
    </View>
    <SkeletonItem height={18} style={styles.priorityBadge} />
  </View>
);

/**
 * Crew card skeleton
 */
const CrewCardSkeleton: React.FC<{ spacing: number }> = ({ spacing }) => (
  <View style={[styles.crewCardContainer, { marginBottom: spacing }]}>
    <SkeletonItem height={40} style={styles.avatar} />
    <View style={styles.crewContent}>
      <SkeletonItem height={14} style={{ width: '70%' }} />
      <View style={{ height: SPACING.xs }} />
      <SkeletonItem height={12} style={{ width: '50%' }} />
    </View>
  </View>
);

/**
 * Form field skeleton
 */
const FormFieldSkeleton: React.FC<{ spacing: number }> = ({ spacing }) => (
  <View style={[styles.formFieldContainer, { marginBottom: spacing }]}>
    <SkeletonItem height={14} style={{ width: '40%', marginBottom: SPACING.sm }} />
    <SkeletonItem height={40} />
    <View style={{ height: SPACING.xs }} />
    <SkeletonItem height={12} style={{ width: '30%' }} />
  </View>
);

/**
 * Loading Skeleton component with variants
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 5,
  type,
  spacing = SPACING.md,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'task':
        return Array.from({ length: count }).map((_, i) => (
          <TaskSkeleton key={i} spacing={spacing} />
        ));
      case 'crewCard':
        return Array.from({ length: count }).map((_, i) => (
          <CrewCardSkeleton key={i} spacing={spacing} />
        ));
      case 'formField':
        return Array.from({ length: count }).map((_, i) => (
          <FormFieldSkeleton key={i} spacing={spacing} />
        ));
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderSkeleton()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskCheckbox: {
    width: 22,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  priorityBadge: {
    width: 40,
    height: 18,
  },
  crewCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 40,
    borderRadius: RADIUS.md,
  },
  crewContent: {
    flex: 1,
  },
  formFieldContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
