import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface SiteInfoCardProps {
  name: string;
  address: string;
  shift: string;
  crewCount: number;
  weather: {
    temp: string;
    icon: string;
  };
  tasks: {
    completed: number;
    total: number;
  };
}

export const SiteInfoCard: React.FC<SiteInfoCardProps> = ({
  name,
  address,
  shift,
  crewCount,
  weather,
  tasks,
}) => {
  return (
    <View style={styles.container}>
      {/* Header with title and weather */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.siteName, TEXT_STYLES.h4]}>{name}</Text>
          <Text style={[styles.address, TEXT_STYLES.body12]}>{address}</Text>
        </View>
        <View style={styles.weather}>
          <Text style={styles.weatherIcon}>{weather.icon}</Text>
          <Text style={[styles.weatherTemp, TEXT_STYLES.body13]}>
            {weather.temp}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer with metrics */}
      <View style={styles.footer}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, TEXT_STYLES.body11]}>Shift</Text>
          <Text style={[styles.metricValue, TEXT_STYLES.body13]}>{shift}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metric}>
          <Text style={[styles.metricLabel, TEXT_STYLES.body11]}>Crew</Text>
          <Text style={[styles.metricValue, TEXT_STYLES.body13]}>
            {crewCount} members
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metric}>
          <Text style={[styles.metricLabel, TEXT_STYLES.body11]}>Tasks</Text>
          <Text style={[styles.metricValue, TEXT_STYLES.body13]}>
            {tasks.completed}/{tasks.total}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  siteName: {
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  address: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  weather: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  weatherIcon: {
    fontSize: 22,
  },
  weatherTemp: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: SPACING.xs,
  },
  metricValue: {
    color: '#FFFFFF',
    fontFamily: 'JetBrainsMono-Regular',
    fontWeight: '800',
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
