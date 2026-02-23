import { useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * Hook to get detailed sync statistics and status
 * Useful for progress indicators and sync monitoring
 */
export function useSyncStatus() {
  const { queue, failedItems, isSyncing, isOnline, lastSyncAt } = useSelector(
    (state: RootState) => state.offline
  );

  // Calculate stats
  const pendingItems = queue.filter((item) => item.retryCount === 0);
  const retryingItems = queue.filter((item) => item.retryCount > 0);
  const totalQueued = queue.length;

  return {
    // Sync state
    isSyncing,
    isOnline,
    lastSyncAt,
    lastSyncTime: lastSyncAt ? new Date(lastSyncAt).toLocaleTimeString() : null,

    // Queue stats
    totalQueued,
    pendingItems: pendingItems.length,
    retryingItems: retryingItems.length,
    failedItems: failedItems.length,

    // Derived states
    hasQueue: totalQueued > 0,
    hasFailed: failedItems.length > 0,
    isStuck: !isOnline && totalQueued > 0, // Offline with items
    needsAttention: failedItems.length > 0, // Failed items need retry

    // Operations by type (helpful for debugging)
    operationsByType: {
      create: queue.filter((item) => item.operation === 'create').length,
      update: queue.filter((item) => item.operation === 'update').length,
      delete: queue.filter((item) => item.operation === 'delete').length,
    },

    // Collections involved
    collectionsByType: {
      tasks: queue.filter((item) => item.collection === 'tasks').length,
      forms: queue.filter(
        (item) =>
          item.collection === 'formTemplates' || item.collection === 'formSubmissions'
      ).length,
      crew: queue.filter((item) => item.collection === 'crew').length,
    },
  };
}
