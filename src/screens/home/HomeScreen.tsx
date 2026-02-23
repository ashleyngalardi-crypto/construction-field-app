import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { RootState } from '../../store';
import { CalendarGrid } from '../../components/home/CalendarGrid';
import { SiteInfoCard } from '../../components/home/SiteInfoCard';
import { TaskItem } from '../../components/home/TaskItem';
import { QuickActions } from '../../components/home/QuickActions';

interface TaskData {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  time: string;
  assignee?: string;
}

interface InspectionData {
  id: number;
  equipment: string;
  status: 'pending' | 'complete' | 'failed';
  note?: string;
  time: string;
  assignee?: string;
}

export const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(22); // Default to today
  const user = useSelector((state: RootState) => state.auth.user);
  const [tasksVisible, setTasksVisible] = useState(true);
  const [inspectionsVisible, setInspectionsVisible] = useState(true);

  // Mock data - will be replaced with Redux selectors
  const siteInfo = {
    name: 'Downtown Plaza Project',
    address: '123 Main St, New York, NY',
    shift: '6:00 AM – 3:30 PM',
    crewCount: 12,
    weather: {
      temp: '68°F',
      icon: '☀️',
    },
    tasks: {
      completed: 8,
      total: 14,
    },
  };

  const todaysTasks: TaskData[] = [
    {
      id: 1,
      text: 'Complete foundation inspection',
      priority: 'high',
      done: false,
      time: '9:00 AM',
      assignee: 'John D.',
    },
    {
      id: 2,
      text: 'Install steel framing - Section A',
      priority: 'high',
      done: false,
      time: '10:30 AM',
      assignee: 'Mike R.',
    },
    {
      id: 3,
      text: 'Daily safety briefing',
      priority: 'medium',
      done: true,
      time: '8:00 AM',
    },
    {
      id: 4,
      text: 'Material delivery sign-off',
      priority: 'medium',
      done: false,
      time: '2:00 PM',
      assignee: 'Sarah L.',
    },
    {
      id: 5,
      text: 'Cleanup and equipment check',
      priority: 'low',
      done: false,
      time: '3:00 PM',
    },
  ];

  const todaysInspections: InspectionData[] = [
    {
      id: 1,
      equipment: 'Excavator - CAT 320',
      status: 'pending',
      note: 'Daily pre-start check',
      time: '7:30 AM',
      assignee: 'Tom',
    },
    {
      id: 2,
      equipment: 'Concrete Pump Truck',
      status: 'complete',
      note: 'Safety inspection passed',
      time: '9:15 AM',
      assignee: 'Dave',
    },
  ];

  const handleTaskToggle = (taskId: number) => {
    // TODO: Dispatch Redux action to update task
    console.log('Toggle task:', taskId);
  };

  const handleDateSelect = (day: number | null) => {
    setSelectedDate(day);
    // TODO: Load data for selected date
  };

  const completedCount = todaysTasks.filter((t) => t.done).length;
  const completedInspections = todaysInspections.filter(
    (i) => i.status === 'complete'
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, TEXT_STYLES.body12]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text style={[styles.title, TEXT_STYLES.h2]}>Today's Schedule</Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendarSection}>
          <CalendarGrid selectedDate={selectedDate} onDateSelect={handleDateSelect} />
        </View>

        {/* Site Info Card */}
        <View style={styles.siteCardSection}>
          <SiteInfoCard
            name={siteInfo.name}
            address={siteInfo.address}
            shift={siteInfo.shift}
            crewCount={siteInfo.crewCount}
            weather={siteInfo.weather}
            tasks={siteInfo.tasks}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <QuickActions />
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setTasksVisible(!tasksVisible)}
          >
            <Text style={[styles.sectionTitle, TEXT_STYLES.h4]}>
              Tasks ({completedCount}/{todaysTasks.length})
            </Text>
            <Text
              style={[
                styles.chevron,
                { transform: [{ rotate: tasksVisible ? '90deg' : '0deg' }] },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          {tasksVisible && (
            <View style={styles.tasksList}>
              {todaysTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleTaskToggle(task.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Inspections Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setInspectionsVisible(!inspectionsVisible)}
          >
            <Text style={[styles.sectionTitle, TEXT_STYLES.h4]}>
              Inspections ({completedInspections}/{todaysInspections.length})
            </Text>
            <Text
              style={[
                styles.chevron,
                {
                  transform: [{ rotate: inspectionsVisible ? '90deg' : '0deg' }],
                },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          {inspectionsVisible && (
            <View style={styles.inspectionsList}>
              {todaysInspections.map((inspection) => (
                <View key={inspection.id} style={styles.inspectionItem}>
                  <View
                    style={[
                      styles.inspectionStatus,
                      styles[`status_${inspection.status}`],
                    ]}
                  >
                    <Text style={styles.statusEmoji}>
                      {inspection.status === 'complete'
                        ? '✓'
                        : inspection.status === 'failed'
                          ? '✕'
                          : '⊙'}
                    </Text>
                  </View>
                  <View style={styles.inspectionContent}>
                    <Text style={[styles.inspectionName, TEXT_STYLES.body13]}>
                      {inspection.equipment}
                    </Text>
                    {inspection.note && (
                      <Text style={[styles.inspectionNote, TEXT_STYLES.body12]}>
                        {inspection.note}
                      </Text>
                    )}
                    <Text style={[styles.inspectionTime, TEXT_STYLES.body11]}>
                      {inspection.time}
                    </Text>
                  </View>
                  {inspection.assignee && (
                    <Text style={[styles.assigneeBadge, TEXT_STYLES.label]}>
                      {inspection.assignee}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Spacing at bottom */}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  greeting: {
    color: COLORS.textMid,
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.text,
  },
  calendarSection: {
    marginBottom: SPACING.lg,
  },
  siteCardSection: {
    marginBottom: SPACING.lg,
  },
  quickActionsSection: {
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.text,
  },
  chevron: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  tasksList: {
    gap: SPACING.sm,
    paddingTop: SPACING.md,
  },
  inspectionsList: {
    gap: SPACING.sm,
    paddingTop: SPACING.md,
  },
  inspectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  inspectionStatus: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  status_pending: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1.5,
    borderColor: '#FFB74D',
  },
  status_complete: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: COLORS.success,
  },
  status_failed: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  statusEmoji: {
    fontSize: 16,
  },
  inspectionContent: {
    flex: 1,
  },
  inspectionName: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  inspectionNote: {
    color: COLORS.textMid,
    marginBottom: SPACING.xs,
  },
  inspectionTime: {
    color: COLORS.textLight,
  },
  assigneeBadge: {
    backgroundColor: COLORS.admin,
    color: '#FFFFFF',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
});
