import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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

type HomeScreenProps = NativeStackScreenProps<any, 'HomeMain'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(22); // Default to today
  const [tasksVisible, setTasksVisible] = useState(true);
  const [inspectionsVisible, setInspectionsVisible] = useState(true);

  // Redux selectors
  const user = useSelector((state: RootState) => state.auth.user);
  const todaysTasks = useSelector((state: RootState) => state.admin.todaysTasks);
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  // Fallback site info - will be replaced with real data when available
  const siteInfo = {
    name: user?.companyId ? `${user.fullName}'s Worksite` : 'Today\'s Schedule',
    address: 'Active jobsite',
    shift: '6:00 AM – 3:30 PM',
    crewCount: 1, // Placeholder
    weather: {
      temp: '72°F',
      icon: '🌤️',
    },
    tasks: {
      completed: todaysTasks.filter((t) => t.status === 'completed').length,
      total: todaysTasks.length,
    },
  };

  // For now, we'll keep mock inspections since they're not in the schema yet
  const todaysInspections: InspectionData[] = [];

  // Task navigation handler
  const handleTaskPress = useCallback(
    (taskId: string) => {
      // Navigate to task detail screen
      navigation.navigate('TaskDetail', { taskId });
    },
    [navigation]
  );

  const handleTaskToggle = useCallback(
    (taskId: string) => {
      // TODO: Dispatch Redux action to update task status
      console.log('Toggle task:', taskId);
    },
    []
  );

  const handleDateSelect = useCallback((day: number | null) => {
    setSelectedDate(day);
    // TODO: Load data for selected date
  }, []);

  const completedCount = todaysTasks.filter((t) => t.status === 'completed').length;
  const completedInspections = todaysInspections.filter(
    (i) => i.status === 'complete'
  ).length;

  // Show empty state if no tasks
  const showEmpty = !isLoading && todaysTasks.length === 0;

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

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={[styles.loadingText, TEXT_STYLES.body14]}>
              Loading tasks...
            </Text>
          </View>
        )}

        {/* Empty State */}
        {showEmpty && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon]}>📋</Text>
            <Text style={[styles.emptyTitle, TEXT_STYLES.body14]}>
              No tasks assigned
            </Text>
            <Text style={[styles.emptySubtitle, TEXT_STYLES.body12]}>
              Check back later for assignments
            </Text>
          </View>
        )}

        {/* Tasks Section */}
        {!isLoading && todaysTasks.length > 0 && (
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
                  <TouchableOpacity
                    key={task.id}
                    onPress={() => handleTaskPress(task.id)}
                    activeOpacity={0.7}
                  >
                    <TaskItem
                      task={{
                        id: parseInt(task.id) || 0,
                        text: task.text,
                        priority: task.priority as 'high' | 'medium' | 'low',
                        done: task.status === 'completed',
                        time: task.scheduledTime
                          ? new Date(task.scheduledTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'TBD',
                        assignee: task.assigneeId || 'Unassigned',
                      }}
                      onToggle={() => handleTaskToggle(task.id)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

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
  loadingContainer: {
    paddingVertical: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
  },
  emptyContainer: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    color: COLORS.textLight,
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
