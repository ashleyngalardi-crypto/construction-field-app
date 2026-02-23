import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface TabConfig {
  icon: string;
  label: string;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  Home: { icon: '📅', label: 'Today' },
  Projects: { icon: '🏗️', label: 'Projects' },
  Photos: { icon: '📷', label: 'Photos' },
  Crew: { icon: '👷', label: 'Crew' },
  More: { icon: '☰', label: 'More' },
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIGS[route.name];

          const onPress = () => {
            navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            } as any);

            if (!isFocused) {
              navigation.navigate(route.name as any);
            }
          };

          if (!config) return null;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.icon,
                  isFocused && styles.iconActive,
                ]}
              >
                {config.icon}
              </Text>
              <Text
                style={[
                  styles.label,
                  TEXT_STYLES.body10,
                  isFocused ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {config.label}
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
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? SPACING.md : 0,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontWeight: '500',
  },
  labelInactive: {
    color: COLORS.textLight,
    opacity: 0.5,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
