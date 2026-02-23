import { useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * Hook to get current network and offline queue status
 * Useful for components that need to react to connection changes
 */
export function useNetworkStatus() {
  const offlineState = useSelector((state: RootState) => state.offline);

  return {
    isOnline: offlineState.isOnline,
    isSyncing: offlineState.isSyncing,
    queueLength: offlineState.queue.length,
    failedCount: offlineState.failedItems.length,
    lastSyncAt: offlineState.lastSyncAt,
    hasQueue: offlineState.queue.length > 0,
    hasFailed: offlineState.failedItems.length > 0,
  };
}
