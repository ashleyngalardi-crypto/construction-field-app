import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface Task {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  time: string;
  assignee?: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

const priorityColors = {
  high: COLORS.danger,
  medium: '#D4930D',
  low: '#2B6CB0',
};

export const TaskItem = React.memo<TaskItemProps>(({ task, onToggle }) => {
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Med';
      case 'low':
        return 'Low';
      default:
        return priority;
    }
  };

  return (
    <View
      style={[
        styles.container,
        task.done && styles.containerDone,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.done && styles.checkboxDone,
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
        accessible
        accessibilityRole="checkbox"
        accessibilityLabel={`Task: ${task.text}`}
        accessibilityHint={task.done ? 'Completed' : 'Pending'}
        accessibilityState={{ checked: task.done }}
      >
        {task.done && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.taskText,
            TEXT_STYLES.body13,
            task.done && styles.taskTextDone,
          ]}
        >
          {task.text}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.time, TEXT_STYLES.body11]}>
            {task.time}
          </Text>
          {task.assignee && (
            <View style={styles.assigneeBadge}>
              <Text style={[styles.assigneeBadgeText, TEXT_STYLES.body10]}>
                {task.assignee}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View
        style={[
          styles.priorityBadge,
          { backgroundColor: priorityColors[task.priority] },
        ]}
      >
        <Text style={[styles.priorityText, TEXT_STYLES.label]}>
          {getPriorityLabel(task.priority)}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  containerDone: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    opacity: 0.6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  taskText: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMid,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  time: {
    color: COLORS.textMid,
  },
  assigneeBadge: {
    backgroundColor: COLORS.admin,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  assigneeBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  priorityBadge: {
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    flexShrink: 0,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
});
