import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchCrewMembers, createNewTask, assignTaskToMember } from '../../store/slices/adminSlice';
import { Button } from '../../components/common/Button';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

export const TaskCreationScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({
  onNavigate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { crew, isLoading } = useSelector((state: RootState) => state.admin);

  const [taskText, setTaskText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.companyId) {
      dispatch(fetchCrewMembers(user.companyId));
    }
  }, [user?.companyId, dispatch]);

  const handleSelectAssignee = useCallback((crewId: string) => {
    setSelectedAssignee(crewId);
    setShowAssigneeModal(false);
  }, []);

  const handleSelectPriority = useCallback((p: 'high' | 'medium' | 'low') => {
    setPriority(p);
    setShowPriorityModal(false);
  }, []);

  const handleCreateTask = async () => {
    if (!taskText.trim() || !user?.companyId) {
      alert('Please enter a task name');
      return;
    }

    if (!selectedAssignee) {
      alert('Please assign the task to a crew member');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        jobSiteId: user.companyId, // Using company ID as placeholder
        createdBy: user.id,
        text: taskText,
        description,
        priority,
        status: 'pending' as const,
        dueDate: Date.now() + 86400000, // Tomorrow
      };

      const createTaskResult = await dispatch(
        createNewTask({
          companyId: user.companyId,
          taskData: taskData as any,
        })
      );

      if (createTaskResult.payload) {
        const taskId = (createTaskResult.payload as any).id;
        // Assign to crew member
        await dispatch(
          assignTaskToMember({
            taskId,
            crewMemberId: selectedAssignee,
          })
        );

        // Reset form
        setTaskText('');
        setDescription('');
        setPriority('medium');
        setSelectedAssignee(null);
        alert('Task created and assigned successfully!');
        onNavigate?.('Home');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const assignedCrewMember = crew.find((c) => c.id === selectedAssignee);
  const priorityColors = {
    high: COLORS.danger,
    medium: COLORS.warning,
    low: COLORS.info,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={TEXT_STYLES.h2}>Create Task</Text>
          <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>
            Assign work to crew members
          </Text>
        </View>

        {/* Task Name Input */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label13}>Task Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name..."
            placeholderTextColor={COLORS.textMid}
            value={taskText}
            onChangeText={setTaskText}
            editable={!isSubmitting}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label13}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add details about this task..."
            placeholderTextColor={COLORS.textMid}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!isSubmitting}
          />
        </View>

        {/* Priority Selector */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label13}>Priority</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowPriorityModal(true)}
            disabled={isSubmitting}
          >
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: priorityColors[priority] },
              ]}
            />
            <Text style={TEXT_STYLES.body14}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Text>
            <Text style={{ flex: 1 }} />
            <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Assignee Selector */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label13}>Assign To *</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowAssigneeModal(true)}
            disabled={isSubmitting}
          >
            {assignedCrewMember ? (
              <View style={styles.assigneeDisplay}>
                <View style={styles.miniAvatar}>
                  <Text style={[TEXT_STYLES.label11, { color: COLORS.white }]}>
                    {assignedCrewMember.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>
                <View>
                  <Text style={TEXT_STYLES.body14}>{assignedCrewMember.name}</Text>
                  <Text style={[TEXT_STYLES.label11, { color: COLORS.textMid }]}>
                    {assignedCrewMember.role}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>
                Select crew member...
              </Text>
            )}
            <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.actionSection}>
          <Button
            label={isSubmitting ? 'Creating...' : 'Create Task'}
            variant="primary"
            onPress={handleCreateTask}
            loading={isSubmitting}
            disabled={isSubmitting || !taskText.trim() || !selectedAssignee}
          />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={() => onNavigate?.('Home')}
            disabled={isSubmitting}
          />
        </View>

        <View style={{ height: SPACING.lg }} />
      </ScrollView>

      {/* Priority Modal */}
      <Modal
        visible={showPriorityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={TEXT_STYLES.h3}>Select Priority</Text>
            {(['high', 'medium', 'low'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.modalOption, priority === p && styles.modalOptionSelected]}
                onPress={() => handleSelectPriority(p)}
              >
                <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[p] }]} />
                <Text style={[TEXT_STYLES.body14, priority === p && { color: COLORS.primary }]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Assignee Modal */}
      <Modal
        visible={showAssigneeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAssigneeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={TEXT_STYLES.h3}>Select Crew Member</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : crew.length > 0 ? (
              <View style={{ height: 400 }}>
                <FlashList
                  data={crew}
                  renderItem={({ item }: { item: typeof crew[0] }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        selectedAssignee === item.id && styles.modalOptionSelected,
                      ]}
                      onPress={() => handleSelectAssignee(item.id)}
                    >
                      <View style={styles.miniAvatar}>
                        <Text style={[TEXT_STYLES.label11, { color: COLORS.white }]}>
                          {item.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </Text>
                      </View>
                      <View>
                        <Text style={TEXT_STYLES.body14}>{item.name}</Text>
                        <Text style={[TEXT_STYLES.label11, { color: COLORS.textMid }]}>
                          {item.role}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item: typeof crew[0]) => item.id}
                />
              </View>
            ) : (
              <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>
                No crew members available
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  textArea: {
    paddingTop: SPACING.md,
    textAlignVertical: 'top',
  },
  selectorButton: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  assigneeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionSection: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    width: '85%',
    maxHeight: '70%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionSelected: {
    backgroundColor: `${COLORS.primary}10`,
  },
});
