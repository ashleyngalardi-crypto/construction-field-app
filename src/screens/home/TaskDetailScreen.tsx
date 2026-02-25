import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Task } from '../../services/api/taskService';
import { getFormTemplates } from '../../services/api/formService';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

type TaskDetailScreenProps = NativeStackScreenProps<any, 'TaskDetail'>;

interface TaskDetailNavigationParams {
  taskId: string;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { taskId } = route.params as TaskDetailNavigationParams;

  // Redux selectors
  const user = useSelector((state: RootState) => state.auth.user);
  const allTasks = useSelector((state: RootState) => state.admin.todaysTasks);
  const formTemplates = useSelector((state: RootState) => state.admin.formTemplates);

  // Find the task
  const task = useMemo(() => {
    return allTasks.find((t) => t.id === taskId);
  }, [allTasks, taskId]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartForm = useCallback(async () => {
    if (!task) {
      Alert.alert('Error', 'Task not found');
      return;
    }

    if (formTemplates.length === 0) {
      Alert.alert('No Forms Available', 'No forms are assigned to this task');
      return;
    }

    // For now, start with the first available form
    // In a real app, this would let the user select from multiple forms
    const form = formTemplates[0];

    navigation.navigate('FormFilling', {
      formTemplate: form,
      taskId: task.id,
    });
  }, [task, formTemplates, navigation]);

  const handleMarkComplete = useCallback(() => {
    Alert.alert(
      'Mark Task Complete?',
      'This will mark the task as completed. This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Complete',
          onPress: () => {
            // TODO: Dispatch Redux action to update task status
            console.log('Mark task complete:', taskId);
            Alert.alert('Success', 'Task marked as complete');
            navigation.goBack();
          },
          style: 'default',
        },
      ]
    );
  }, [taskId, navigation]);

  // Loading state
  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContent}>
          <Text style={[styles.loadingTitle, TEXT_STYLES.h2]}>Task Details</Text>
          <LoadingSkeleton type="task" count={4} spacing={SPACING.md} />
        </View>
      </SafeAreaView>
    );
  }

  const priorityColors = {
    high: COLORS.danger,
    medium: '#FFB74D',
    low: COLORS.success,
  };

  const statusDisplay = {
    pending: { label: 'Pending', icon: '⏳', color: '#FFB74D' },
    in_progress: { label: 'In Progress', icon: '⚙️', color: COLORS.primary },
    completed: { label: 'Completed', icon: '✓', color: COLORS.success },
    cancelled: { label: 'Cancelled', icon: '✕', color: COLORS.textLight },
  };

  const status = statusDisplay[task.status as keyof typeof statusDisplay] || statusDisplay.pending;
  const dueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.headerButton, { color: COLORS.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, TEXT_STYLES.h2]}>Task Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
          <Text style={styles.statusIcon}>{status.icon}</Text>
          <Text style={[styles.statusLabel, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.taskTitle, TEXT_STYLES.h1]}>{task.text}</Text>

        {/* Description */}
        {task.description && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, TEXT_STYLES.label]}>Description</Text>
            <Text style={[styles.descriptionText, TEXT_STYLES.body14]}>
              {task.description}
            </Text>
          </View>
        )}

        {/* Key Information */}
        <View style={styles.infoGrid}>
          {/* Priority */}
          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, TEXT_STYLES.body12]}>Priority</Text>
            <View
              style={[
                styles.infoBadge,
                { backgroundColor: priorityColors[task.priority as keyof typeof priorityColors] + '20' },
              ]}
            >
              <Text
                style={[
                  styles.infoBadgeText,
                  { color: priorityColors[task.priority as keyof typeof priorityColors] },
                ]}
              >
                {task.priority.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, TEXT_STYLES.body12]}>Due Date</Text>
            <Text style={[styles.infoValue, TEXT_STYLES.body14]}>{dueDate}</Text>
          </View>

          {/* Scheduled Time */}
          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, TEXT_STYLES.body12]}>Scheduled Time</Text>
            <Text style={[styles.infoValue, TEXT_STYLES.body14]}>
              {task.scheduledTime
                ? new Date(task.scheduledTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'TBD'}
            </Text>
          </View>

          {/* Assignee */}
          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, TEXT_STYLES.body12]}>Assigned To</Text>
            <Text style={[styles.infoValue, TEXT_STYLES.body14]}>
              {task.assigneeId || 'Unassigned'}
            </Text>
          </View>
        </View>

        {/* Created By */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Created by: {task.createdBy}
          </Text>
          <Text style={[styles.sectionLabel, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            {new Date(task.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Available Forms */}
        {formTemplates.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, TEXT_STYLES.label]}>
              Available Forms
            </Text>
            {formTemplates.map((form) => (
              <View key={form.id} style={styles.formCard}>
                <View style={styles.formCardContent}>
                  <Text style={styles.formIcon}>{form.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.formName, TEXT_STYLES.body14]}>
                      {form.name}
                    </Text>
                    <Text style={[styles.formType, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
                      {form.templateType}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Help Text */}
        <View style={styles.helpText}>
          <Text style={[TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            📌 Click "Start Form" to fill out inspection forms for this task
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {task.status !== 'completed' && (
          <>
            <Button
              label="Start Form"
              onPress={handleStartForm}
              variant="primary"
              size="md"
              style={styles.footerButton}
              testID="start-form-btn"
            />
            <Button
              label="Mark Complete"
              onPress={handleMarkComplete}
              variant="success"
              size="md"
              style={styles.footerButton}
              testID="mark-complete-btn"
            />
          </>
        )}
        {task.status === 'completed' && (
          <View style={styles.completedMessage}>
            <Text style={[styles.completedText, TEXT_STYLES.body14]}>
              ✓ This task is complete
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
  },
  loadingContent: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  loadingTitle: {
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  statusLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
  taskTitle: {
    color: COLORS.text,
    marginBottom: SPACING.lg,
    lineHeight: 40,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    color: COLORS.text,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  infoLabel: {
    color: COLORS.textLight,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: '600',
  },
  infoBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  infoBadgeText: {
    fontWeight: '600',
    fontSize: 11,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  formName: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  formType: {
    color: COLORS.textLight,
  },
  helpText: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: SPACING.sm,
  },
  footerButton: {
    width: '100%',
  },
  completedMessage: {
    backgroundColor: COLORS.success + '20',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  completedText: {
    color: COLORS.success,
    fontWeight: '600',
  },
});
