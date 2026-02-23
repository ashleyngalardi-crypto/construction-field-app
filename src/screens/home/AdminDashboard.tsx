import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchCrewMembers, fetchCrewWorkloads, fetchJobSiteTasks } from '../../store/slices/adminSlice';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface CrewWorkloadDisplay {
  crewMemberId: string;
  name: string;
  role: string;
  openTasks: number;
  completedTasks: number;
  inspectionsPending: number;
  averageCompletionTime: number;
}

export const AdminDashboard: React.FC<{ onNavigate?: (screen: string) => void }> = ({ onNavigate }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { crew, crewWorkloads, isLoading, error } = useSelector((state: RootState) => state.admin);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.companyId) {
      dispatch(fetchCrewMembers(user.companyId));
    }
  }, [user?.companyId, dispatch]);

  useEffect(() => {
    if (crew.length > 0) {
      dispatch(fetchCrewWorkloads(crew));
    }
  }, [crew, dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user?.companyId) {
      await dispatch(fetchCrewMembers(user.companyId));
    }
    setRefreshing(false);
  }, [user?.companyId, dispatch]);

  // Memoize crew workload calculation
  const crewWithWorkload: CrewWorkloadDisplay[] = useMemo(() => {
    return crew.map((member) => {
      const workload = crewWorkloads.find((w) => w.crewMemberId === member.id);
      return {
        crewMemberId: member.id,
        name: member.name,
        role: member.role,
        openTasks: workload?.openTasks || 0,
        completedTasks: workload?.completedTasks || 0,
        inspectionsPending: workload?.inspectionsPending || 0,
        averageCompletionTime: workload?.averageCompletionTime || 0,
      };
    });
  }, [crew, crewWorkloads]);

  const totalStats = useMemo(() => ({
    totalCrew: crew.length,
    openTasks: crewWithWorkload.reduce((sum, c) => sum + c.openTasks, 0),
    completedTasks: crewWithWorkload.reduce((sum, c) => sum + c.completedTasks, 0),
    pendingInspections: crewWithWorkload.reduce((sum, c) => sum + c.inspectionsPending, 0),
  }), [crew.length, crewWithWorkload]);

  // Memoized workload card component
  const WorkloadCard = React.memo(({ item }: { item: CrewWorkloadDisplay }) => (
    <TouchableOpacity
      style={styles.workloadCard}
      onPress={() => onNavigate?.('CrewDetail')}
    >
      <View style={styles.workloadHeader}>
        <View>
          <Text style={TEXT_STYLES.body16}>{item.name}</Text>
          <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>{item.role}</Text>
        </View>
        <View style={styles.completionBadge}>
          <Text style={TEXT_STYLES.label12}>{item.completedTasks}</Text>
        </View>
      </View>

      <View style={styles.workloadStats}>
        <View style={styles.statItem}>
          <Text style={TEXT_STYLES.label11}>Open Tasks</Text>
          <Text style={[TEXT_STYLES.body14, { color: COLORS.warning }]}>{item.openTasks}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={TEXT_STYLES.label11}>Inspections</Text>
          <Text style={[TEXT_STYLES.body14, { color: COLORS.danger }]}>
            {item.inspectionsPending}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={TEXT_STYLES.label11}>Avg Time</Text>
          <Text style={[TEXT_STYLES.body14, { color: COLORS.text }]}>
            {item.averageCompletionTime}m
          </Text>
        </View>
      </View>

      <View style={styles.taskProgress}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.openTasks + item.completedTasks > 0 ? (item.completedTasks / (item.openTasks + item.completedTasks)) * 100 : 0}%`,
              },
            ]}
          />
        </View>
        <Text style={TEXT_STYLES.label10}>
          {item.completedTasks}/{item.openTasks + item.completedTasks} Complete
        </Text>
      </View>
    </TouchableOpacity>
  ));

  if (isLoading && crew.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={TEXT_STYLES.h2}>Admin Dashboard</Text>
          <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>
            Crew & Workload Management
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: COLORS.info }]}>
            <Text style={TEXT_STYLES.label12}>Total Crew</Text>
            <Text style={[TEXT_STYLES.h3, { color: COLORS.info }]}>{totalStats.totalCrew}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.warning }]}>
            <Text style={TEXT_STYLES.label12}>Open Tasks</Text>
            <Text style={[TEXT_STYLES.h3, { color: COLORS.warning }]}>{totalStats.openTasks}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
            <Text style={TEXT_STYLES.label12}>Completed</Text>
            <Text style={[TEXT_STYLES.h3, { color: COLORS.success }]}>{totalStats.completedTasks}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.danger }]}>
            <Text style={TEXT_STYLES.label12}>Inspections</Text>
            <Text style={[TEXT_STYLES.h3, { color: COLORS.danger }]}>
              {totalStats.pendingInspections}
            </Text>
          </View>
        </View>

        {/* Crew Workload List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={TEXT_STYLES.h3}>Crew Workload</Text>
            <TouchableOpacity onPress={() => onNavigate?.('CrewList')}>
              <Text style={[TEXT_STYLES.label12, { color: COLORS.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={[TEXT_STYLES.body13, { color: COLORS.danger }]}>{error}</Text>
            </View>
          )}

          {crewWithWorkload.length > 0 ? (
            <FlashList
              data={crewWithWorkload}
              renderItem={({ item }) => <WorkloadCard item={item} />}
              keyExtractor={(item) => item.crewMemberId}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>
                No crew members assigned
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
            onPress={() => onNavigate?.('TaskCreation')}
          >
            <Text style={[TEXT_STYLES.label13, { color: COLORS.white }]}>Create Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.admin }]}
            onPress={() => onNavigate?.('FormBuilder')}
          >
            <Text style={[TEXT_STYLES.label13, { color: COLORS.white }]}>Build Form</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
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
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  workloadCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  workloadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  completionBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  workloadStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  taskProgress: {
    marginTop: SPACING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  errorContainer: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  emptyState: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
