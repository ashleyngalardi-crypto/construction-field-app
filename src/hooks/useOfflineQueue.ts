import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  markItemFailed,
  retryFailed,
  clearFailed,
  clearQueue,
} from '../store/slices/offlineSlice';
import { processQueue } from '../services/sync/syncEngine';

/**
 * Hook to interact with the offline sync queue
 * Provides methods to manage failed items and trigger manual sync
 */
export function useOfflineQueue() {
  const dispatch = useDispatch<AppDispatch>();
  const { queue, failedItems, isSyncing, isOnline } = useSelector(
    (state: RootState) => state.offline
  );

  const handleRetryFailed = async () => {
    dispatch(retryFailed());
    // Trigger immediate sync if online
    if (isOnline && !isSyncing) {
      await processQueue(dispatch);
    }
  };

  const handleClearFailed = () => {
    dispatch(clearFailed());
  };

  const handleClearQueue = () => {
    dispatch(clearQueue());
  };

  const handleManualSync = async () => {
    if (isOnline && !isSyncing && queue.length > 0) {
      await processQueue(dispatch);
    }
  };

  return {
    queue,
    failedItems,
    queueLength: queue.length,
    failedCount: failedItems.length,
    isSyncing,
    isOnline,
    retryFailed: handleRetryFailed,
    clearFailed: handleClearFailed,
    clearQueue: handleClearQueue,
    manualSync: handleManualSync,
  };
}
