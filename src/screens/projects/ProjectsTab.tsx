import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface ProjectGroup {
  projectId: string;
  projectName: string;
  taskCount: number;
  completedCount: number;
  pendingCount: number;
}

export const ProjectsTab: React.FC = () => {
  // Redux selectors
  const tasks = useSelector((state: RootState) => state.admin.todaysTasks);
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  // Group tasks by project/jobsite
  const projectGroups = useMemo(() => {
    const grouped: { [key: string]: ProjectGroup } = {};

    tasks.forEach((task) => {
      const projectId = task.jobSiteId || 'unassigned';
      const projectName = task.jobSiteId || 'Unassigned Project';

      if (!grouped[projectId]) {
        grouped[projectId] = {
          projectId,
          projectName,
          taskCount: 0,
          completedCount: 0,
          pendingCount: 0,
        };
      }

      grouped[projectId].taskCount++;
      if (task.status === 'completed') {
        grouped[projectId].completedCount++;
      } else if (task.status === 'pending') {
        grouped[projectId].pendingCount++;
      }
    });

    return Object.values(grouped).sort((a, b) =>
      a.projectName.localeCompare(b.projectName)
    );
  }, [tasks]);

  // Calculate overall statistics
  const stats = useMemo(
    () => ({
      totalProjects: projectGroups.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'completed').length,
      completionRate:
        tasks.length > 0
          ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
          : 0,
    }),
    [projectGroups.length, tasks]
  );

  const handleProjectPress = useCallback((projectId: string) => {
    // TODO: Navigate to project detail or filter tasks
    console.log('Navigate to project:', projectId);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, TEXT_STYLES.body14]}>
            Loading projects...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, TEXT_STYLES.h2]}>Projects</Text>
          <Text style={[styles.subtitle, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Group tasks by site
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalProjects}</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Active Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalTasks}</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>
              {stats.completionRate}%
            </Text>
            <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Complete</Text>
          </View>
        </View>

        {/* Completion Rate */}
        <View style={styles.rateCard}>
          <Text style={[styles.rateLabel, TEXT_STYLES.body12]}>Overall Progress</Text>
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
          <Text style={[styles.rateText, TEXT_STYLES.body12]}>
            {stats.completedTasks} of {stats.totalTasks} tasks completed
          </Text>
        </View>

        {/* Project List */}
        {projectGroups.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, TEXT_STYLES.label]}>Projects</Text>
            {projectGroups.map((project) => {
              const completionPercent =
                project.taskCount > 0
                  ? Math.round((project.completedCount / project.taskCount) * 100)
                  : 0;

              return (
                <TouchableOpacity
                  key={project.projectId}
                  style={styles.projectCard}
                  onPress={() => handleProjectPress(project.projectId)}
                  activeOpacity={0.7}
                >
                  <View style={styles.projectHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.projectName, TEXT_STYLES.body14]} numberOfLines={2}>
                        {project.projectName}
                      </Text>
                      <Text style={[styles.projectStats, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
                        {project.completedCount}/{project.taskCount} tasks
                      </Text>
                    </View>
                    <View style={styles.projectPercentage}>
                      <Text style={[styles.percentageText, TEXT_STYLES.label]}}>
                        {completionPercent}%
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.projectProgressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${completionPercent}%`,
                            backgroundColor:
                              completionPercent > 70 ? COLORS.success : '#FFB74D',
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Task Status Badges */}
                  <View style={styles.badgeContainer}>
                    {project.completedCount > 0 && (
                      <View style={[styles.badge, { backgroundColor: COLORS.success + '20' }]}>
                        <Text style={[styles.badgeText, { color: COLORS.success }]}>
                          ✓ {project.completedCount}
                        </Text>
                      </View>
                    )}
                    {project.pendingCount > 0 && (
                      <View style={[styles.badge, { backgroundColor: '#FFB74D20' }]}>
                        <Text style={[styles.badgeText, { color: '#FFB74D' }]}>
                          ⏳ {project.pendingCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyTitle, TEXT_STYLES.body14]}>
              No projects yet
            </Text>
            <Text style={[styles.emptySubtitle, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
              Assign tasks to see projects here
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
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  title: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textLight,
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
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
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
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
  rateCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  rateLabel: {
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  rateBarContainer: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  rateBar: {
    height: '100%',
    borderRadius: RADIUS.sm,
  },
  rateText: {
    color: COLORS.text,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  projectCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  projectName: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  projectStats: {
    color: COLORS.textLight,
  },
  projectPercentage: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginLeft: SPACING.md,
  },
  percentageText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  projectProgressContainer: {
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.sm,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.lg,
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
