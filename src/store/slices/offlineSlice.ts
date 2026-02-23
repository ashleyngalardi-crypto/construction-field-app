import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SyncQueueItem } from '../../types';

export interface OfflineState {
  queue: SyncQueueItem[];
  failedItems: SyncQueueItem[];
  syncedIds: string[]; // Track synced IDs for deduplication
  isSyncing: boolean;
  isOnline: boolean;
  lastSyncAt: number | null;
  syncError: string | null;
}

const initialState: OfflineState = {
  queue: [],
  failedItems: [],
  syncedIds: [],
  isSyncing: false,
  isOnline: true,
  lastSyncAt: null,
  syncError: null,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    // Queue management
    addToQueue: (state, action: PayloadAction<Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>>) => {
      const newItem: SyncQueueItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
        ...action.payload,
      };
      state.queue.push(newItem);
    },

    removeFromQueue: (state, action: PayloadAction<string>) => {
      const item = state.queue.find((i) => i.id === action.payload);
      if (item) {
        state.queue = state.queue.filter((i) => i.id !== action.payload);
        state.syncedIds.push(action.payload);
      }
    },

    markItemFailed: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const item = state.queue.find((i) => i.id === action.payload.id);
      if (item) {
        state.queue = state.queue.filter((i) => i.id !== action.payload.id);
        state.failedItems.push({
          ...item,
          error: action.payload.error,
        });
        state.syncError = action.payload.error;
      }
    },

    retryFailed: (state) => {
      // Move failed items back to queue
      state.queue.push(...state.failedItems);
      state.failedItems = [];
      state.syncError = null;
    },

    clearFailed: (state) => {
      state.failedItems = [];
      state.syncError = null;
    },

    clearQueue: (state) => {
      state.queue = [];
      state.failedItems = [];
      state.syncedIds = [];
      state.syncError = null;
    },

    // Network status
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },

    updateLastSyncTime: (state) => {
      state.lastSyncAt = Date.now();
      state.syncError = null;
    },

    incrementRetryCount: (state, action: PayloadAction<string>) => {
      const item = state.queue.find((i) => i.id === action.payload);
      if (item) {
        item.retryCount += 1;
      }
    },

    clearOldSyncedIds: (state, action: PayloadAction<number>) => {
      const cutoffTime = Date.now() - action.payload;
      state.syncedIds = state.syncedIds.filter((id) => {
        const timestamp = parseInt(id.split('-')[0], 10);
        return timestamp > cutoffTime;
      });
    },
  },
});

export const {
  addToQueue,
  removeFromQueue,
  markItemFailed,
  retryFailed,
  clearFailed,
  clearQueue,
  setOnlineStatus,
  setSyncing,
  updateLastSyncTime,
  incrementRetryCount,
  clearOldSyncedIds,
} = offlineSlice.actions;

export default offlineSlice.reducer;
