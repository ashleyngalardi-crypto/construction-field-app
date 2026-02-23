import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { processQueue } from '../../services/sync/syncEngine';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

export const OfflineBanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOnline, isSyncing, queue, failedItems, lastSyncAt } = useSelector(
    (state: RootState) => state.offline
  );

  // Don't show banner if online and no pending items
  if (isOnline && queue.length === 0 && failedItems.length === 0) {
    return null;
  }

  const handleRetry = async () => {
    const state = (dispatch as any).getState?.();
    if (isOnline && !isSyncing) {
      await processQueue(dispatch, state);
    }
  };

  // Offline mode - can't sync
  if (!isOnline) {
    return (
      <View style={[styles.banner, styles.offlineBanner]}>
        <View style={styles.content}>
          <Text style={styles.icon}>📡</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Offline Mode</Text>
            <Text style={styles.subtitle}>
              {queue.length > 0 ? `${queue.length} pending changes` : 'No connection'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Syncing in progress
  if (isSyncing) {
    return (
      <View style={[styles.banner, styles.syncingBanner]}>
        <View style={styles.content}>
          <ActivityIndicator size="small" color={COLORS.white} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Syncing...</Text>
            <Text style={styles.subtitle}>
              {queue.length > 0 ? `${queue.length} item(s)` : 'Almost done'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Failed items - show retry option
  if (failedItems.length > 0) {
    return (
      <View style={[styles.banner, styles.errorBanner]}>
        <View style={styles.content}>
          <Text style={styles.icon}>⚠️</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Sync Failed</Text>
            <Text style={styles.subtitle}>{failedItems.length} item(s) need attention</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pending items - show sync progress
  if (queue.length > 0) {
    return (
      <View style={[styles.banner, styles.pendingBanner]}>
        <View style={styles.content}>
          <Text style={styles.icon}>💾</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Pending Sync</Text>
            <Text style={styles.subtitle}>{queue.length} change(s) waiting to sync</Text>
          </View>
        </View>
        {lastSyncAt && (
          <Text style={styles.lastSync}>
            Last sync: {new Date(lastSyncAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...TEXT_STYLES.body14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  subtitle: {
    ...TEXT_STYLES.body12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  lastSync: {
    ...TEXT_STYLES.body11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: SPACING.xs,
  },
  offlineBanner: {
    backgroundColor: COLORS.warning, // Orange/amber for offline
  },
  syncingBanner: {
    backgroundColor: COLORS.primary, // Orange for active sync
  },
  errorBanner: {
    backgroundColor: COLORS.danger, // Red for errors
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingBanner: {
    backgroundColor: COLORS.info ?? COLORS.blue, // Blue for pending
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  retryButtonText: {
    ...TEXT_STYLES.body12,
    color: COLORS.white,
    fontWeight: '600',
  },
});
