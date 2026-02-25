import { addToQueue } from '../../store/slices/offlineSlice';
import { SyncQueueItem } from '../../types';

// Lazy-load store to avoid circular dependency
function getStore() {
  return require('../../store').store;
}

/**
 * Check if currently online
 */
export function isOnline(): boolean {
  const store = getStore();
  const state = store.getState();
  return state.offline.isOnline;
}

/**
 * Queue an operation for later sync
 */
export function queueOperation(
  item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>
): void {
  const store = getStore();
  const queueItem: SyncQueueItem = {
    id: generateTempId(),
    ...item,
    timestamp: Date.now(),
    retryCount: 0,
  };
  store.dispatch(addToQueue(queueItem));
}

/**
 * Get current online status (for reactive updates, use useSelector in components)
 */
export function getNetworkStatus() {
  const store = getStore();
  const state = store.getState();
  return {
    isOnline: state.offline.isOnline,
    isSyncing: state.offline.isSyncing,
    queueLength: state.offline.queue.length,
  };
}

/**
 * Generate temporary ID for optimistic updates
 */
export function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Mark response as pending (awaiting sync)
 */
export function markAsPending<T extends { id: string }>(data: T): T & { _isPending: boolean } {
  return {
    ...data,
    _isPending: true,
  };
}
