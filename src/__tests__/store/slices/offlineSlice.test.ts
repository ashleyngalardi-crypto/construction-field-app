import offlineReducer, {
  addToQueue,
  removeFromQueue,
  markItemFailed,
  retryFailed,
  clearFailed,
  setOnlineStatus,
  setSyncing,
  updateLastSyncTime,
} from '../../../store/slices/offlineSlice';
import { SyncQueueItem } from '../../../types';

describe('Offline Slice', () => {
  const initialState = {
    queue: [],
    failedItems: [],
    syncedIds: [],
    isSyncing: false,
    isOnline: true,
    lastSyncAt: null,
    syncError: null,
  };

  describe('addToQueue', () => {
    it('should add item to queue', () => {
      const item: SyncQueueItem = {
        id: 'test-1',
        collection: 'tasks',
        operation: 'create',
        documentId: 'task-1',
        data: { text: 'Test' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      const state = offlineReducer(initialState, addToQueue(item));

      expect(state.queue).toHaveLength(1);
      expect(state.queue[0]).toEqual(item);
    });

    it('should add multiple items to queue', () => {
      const item1: SyncQueueItem = {
        id: 'test-1',
        collection: 'tasks',
        operation: 'create',
        documentId: 'task-1',
        data: { text: 'Test 1' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      const item2: SyncQueueItem = {
        id: 'test-2',
        collection: 'tasks',
        operation: 'update',
        documentId: 'task-2',
        data: { text: 'Test 2' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      let state = offlineReducer(initialState, addToQueue(item1));
      state = offlineReducer(state, addToQueue(item2));

      expect(state.queue).toHaveLength(2);
    });
  });

  describe('removeFromQueue', () => {
    it('should remove item from queue by id', () => {
      const item: SyncQueueItem = {
        id: 'test-1',
        collection: 'tasks',
        operation: 'create',
        documentId: 'task-1',
        data: { text: 'Test' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      let state = offlineReducer(initialState, addToQueue(item));
      expect(state.queue).toHaveLength(1);

      state = offlineReducer(state, removeFromQueue('test-1'));
      expect(state.queue).toHaveLength(0);
    });
  });

  describe('markItemFailed', () => {
    it('should move item to failed queue', () => {
      const item: SyncQueueItem = {
        id: 'test-1',
        collection: 'tasks',
        operation: 'create',
        documentId: 'task-1',
        data: { text: 'Test' },
        timestamp: Date.now(),
        retryCount: 3,
      };

      let state = offlineReducer(initialState, addToQueue(item));
      state = offlineReducer(
        state,
        markItemFailed({ id: 'test-1', error: 'Failed after 3 retries' })
      );

      expect(state.queue).toHaveLength(0);
      expect(state.failedItems).toHaveLength(1);
      expect(state.failedItems[0].id).toBe('test-1');
    });
  });

  describe('retryFailed', () => {
    it('should move failed items back to queue', () => {
      const item: SyncQueueItem = {
        id: 'test-1',
        collection: 'tasks',
        operation: 'create',
        documentId: 'task-1',
        data: { text: 'Test' },
        timestamp: Date.now(),
        retryCount: 3,
      };

      let state = offlineReducer(initialState, addToQueue(item));
      state = offlineReducer(
        state,
        markItemFailed({ id: 'test-1', error: 'Failed' })
      );
      expect(state.failedItems).toHaveLength(1);

      state = offlineReducer(state, retryFailed());
      expect(state.failedItems).toHaveLength(0);
      expect(state.queue).toHaveLength(1);
      expect(state.queue[0].retryCount).toBe(0); // Reset retry count
    });
  });

  describe('clearFailed', () => {
    it('should clear failed items', () => {
      const item: SyncQueueItem = {
        id: 'test-1',
        collection: 'tasks',
        operation: 'create',
        documentId: 'task-1',
        data: { text: 'Test' },
        timestamp: Date.now(),
        retryCount: 3,
      };

      let state = offlineReducer(initialState, addToQueue(item));
      state = offlineReducer(
        state,
        markItemFailed({ id: 'test-1', error: 'Failed' })
      );
      expect(state.failedItems).toHaveLength(1);

      state = offlineReducer(state, clearFailed());
      expect(state.failedItems).toHaveLength(0);
    });
  });

  describe('setOnlineStatus', () => {
    it('should update online status', () => {
      let state = offlineReducer(initialState, setOnlineStatus(false));
      expect(state.isOnline).toBe(false);

      state = offlineReducer(state, setOnlineStatus(true));
      expect(state.isOnline).toBe(true);
    });
  });

  describe('setSyncing', () => {
    it('should update syncing status', () => {
      let state = offlineReducer(initialState, setSyncing(true));
      expect(state.isSyncing).toBe(true);

      state = offlineReducer(state, setSyncing(false));
      expect(state.isSyncing).toBe(false);
    });
  });

  describe('updateLastSyncTime', () => {
    it('should update last sync timestamp', () => {
      const state = offlineReducer(initialState, updateLastSyncTime());
      expect(state.lastSyncAt).not.toBeNull();
      expect(typeof state.lastSyncAt).toBe('number');
    });
  });
});
