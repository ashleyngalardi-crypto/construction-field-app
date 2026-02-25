import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { Button } from '../../components/common/Button';

type CrewMemberDetailScreenProps = NativeStackScreenProps<any, 'CrewDetail'>;

interface CrewMemberDetailNavigationParams {
  memberId: string;
}

export const CrewMemberDetailScreen: React.FC<CrewMemberDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { memberId } = route.params as CrewMemberDetailNavigationParams;

  // Redux selectors
  const user = useSelector((state: RootState) => state.auth.user);
  const allTasks = useSelector((state: RootState) => state.admin.todaysTasks);
  const crewMembers = useSelector((state: RootState) => state.admin.crew);

  // Find the crew member
  const crewMember = useMemo(() => {
    return crewMembers.find((c) => c.id === memberId);
  }, [crewMembers, memberId]);

  // Get assigned tasks for this crew member
  const assignedTasks = useMemo(() => {
    return allTasks.filter((t) => t.assigneeId === memberId);
  }, [allTasks, memberId]);

  // Calculate statistics
  const stats = useMemo(
    () => ({
      totalTasks: assignedTasks.length,
      completedTasks: assignedTasks.filter((t) => t.status === 'completed').length,
      pendingTasks: assignedTasks.filter((t) => t.status === 'pending').length,
      inProgressTasks: assignedTasks.filter((t) => t.status === 'in_progress').length,
      completionRate:
        assignedTasks.length > 0
          ? Math.round((assignedTasks.filter((t) => t.status === 'completed').length / assignedTasks.length) * 100)
          : 0,
    }),
    [assignedTasks]
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTaskPress = useCallback(
    (taskId: string) => {
      navigation.navigate('TaskDetail', { taskId });
    },
    [navigation]
  );

  const handleContactCrew = useCallback(() => {
    if (!crewMember) return;
    Alert.alert('Contact', `Call ${crewMember.name}: ${crewMember.phoneNumber || 'No phone'}`);
  }, [crewMember]);

  // Loading state
  if (!crewMember) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, TEXT_STYLES.body14]}>
            Loading crew member details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const roleColors = {
    crew: COLORS.primary,
    admin: COLORS.admin,
  };

  const statusColors = {
    pending: '#FFB74D',
    in_progress: COLORS.primary,
    completed: COLORS.success,
  };

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
        <Text style={[styles.headerTitle, TEXT_STYLES.h2]}>Crew Member</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{crewMember.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, TEXT_STYLES.h1]}>{crewMember.name}</Text>
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: roleColors[crewMember.role as keyof typeof roleColors] + '20' },
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  { color: roleColors[crewMember.role as keyof typeof roleColors] },
                ]}
              >
                {crewMember.role.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.label]}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, TEXT_STYLES.body12]}>Role</Text>
            <Text style={[styles.infoValue, TEXT_STYLES.body14]}>
              {crewMember.role ? crewMember.role.charAt(0).toUpperCase() + crewMember.role.slice(1) : 'Crew Member'}
            </Text>
          </View>
          {crewMember.phoneNumber && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, TEXT_STYLES.body12]}>Phone</Text>
              <Text style={[styles.infoValue, TEXT_STYLES.body14]}>{crewMember.phoneNumber}</Text>
            </View>
          )}
          {crewMember.email && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, TEXT_STYLES.body12]}>Email</Text>
              <Text style={[styles.infoValue, TEXT_STYLES.body14]}>{crewMember.email}</Text>
            </View>
          )}
          <Button
            label="📞 Contact"
            onPress={handleContactCrew}
            variant="secondary"
            size="sm"
            style={styles.contactButton}
          />
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TEXT_STYLES.label]}>Assignment Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalTasks}</Text>
              <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Total Tasks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: COLORS.success }]}>
                {stats.completedTasks}
              </Text>
              <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#FFB74D' }]}>
                {stats.pendingTasks}
              </Text>
              <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Pending</Text>
            </View>
          </View>

          {/* Completion Rate */}
          <View style={styles.completionRateCard}>
            <Text style={[styles.rateLabel, TEXT_STYLES.body12]}>Completion Rate</Text>
            <View style={styles.rateBarContainer}>
              <View
                style={[
                  styles.rateBar,
                  {
                    width: `${stats.completionRate}%`,
                    backgroundColor: stats.completionRate > 70 ? COLORS.success : '#FFB74D',
                  },
                ]}
              />
            </View>
            <Text style={[styles.ratePercentage, TEXT_STYLES.body14]}>
              {stats.completionRate}%
            </Text>
          </View>
        </View>

        {/* Assigned Tasks */}
        {assignedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, TEXT_STYLES.label]}>
              Assigned Tasks ({assignedTasks.length})
            </Text>
            {assignedTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => handleTaskPress(task.id)}
              >
                <View style={[styles.taskStatus, { backgroundColor: statusColors[task.status as keyof typeof statusColors] + '20' }]}>
                  <Text
                    style={[
                      styles.taskStatusIcon,
                      { color: statusColors[task.status as keyof typeof statusColors] },
                    ]}
                  >
                    {task.status === 'completed' ? '✓' : task.status === 'in_progress' ? '⚙️' : '⏳'}
                  </Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, TEXT_STYLES.body14]} numberOfLines={2}>
                    {task.text}
                  </Text>
                  <Text style={[styles.taskTime, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
                    {task.scheduledTime
                      ? new Date(task.scheduledTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'No time set'}
                  </Text>
                </View>
                <Text style={styles.taskChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Tasks State */}
        {assignedTasks.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyTitle, TEXT_STYLES.body14]}>
              No tasks assigned
            </Text>
            <Text style={[styles.emptySubtitle, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
              This crew member doesn't have any assigned tasks yet
            </Text>
          </View>
        )}
      </ScrollView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontSize: 24,
  },
  roleBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontWeight: '600',
    fontSize: 11,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    color: COLORS.textLight,
    fontWeight: '500',
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  contactButton: {
    marginTop: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
  completionRateCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  rateLabel: {
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  rateBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  rateBar: {
    height: '100%',
    borderRadius: RADIUS.sm,
  },
  ratePercentage: {
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'right',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskStatus: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  taskStatusIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  taskTime: {
    color: COLORS.textLight,
  },
  taskChevron: {
    fontSize: 20,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
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
});
