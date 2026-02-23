import { processQueue } from '../../../services/sync/syncEngine';
import * as taskService from '../../../services/api/taskService';
import { SyncQueueItem } from '../../../types';
import { store } from '../../../store';

// Mock the API services
jest.mock('../../../services/api/taskService');

describe('Sync Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processQueue', () => {
    it('should process empty queue without errors', async () => {
      const mockGetState = () => ({
        offline: {
          queue: [],
          isSyncing: false,
          isOnline: true,
          failedItems: [],
          syncedIds: [],
          lastSyncAt: null,
          syncError: null,
        },
      });

      await processQueue(store.dispatch, mockGetState as any);
      // Should complete without errors
      expect(true).toBe(true);
    });

    it('should not process if already syncing', async () => {
      const mockGetState = () => ({
        offline: {
          queue: [
            {
              id: 'test-1',
              collection: 'tasks',
              operation: 'create',
              documentId: 'task-1',
              data: { text: 'Test' },
              timestamp: Date.now(),
              retryCount: 0,
            },
          ],
          isSyncing: true,
          isOnline: true,
          failedItems: [],
          syncedIds: [],
          lastSyncAt: null,
          syncError: null,
        },
      });

      const mockDispatch = jest.fn();
      await processQueue(mockDispatch, mockGetState as any);

      // Should return early without dispatching
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should not process if offline', async () => {
      const mockGetState = () => ({
        offline: {
          queue: [
            {
              id: 'test-1',
              collection: 'tasks',
              operation: 'create',
              documentId: 'task-1',
              data: { text: 'Test' },
              timestamp: Date.now(),
              retryCount: 0,
            },
          ],
          isSyncing: false,
          isOnline: false,
          failedItems: [],
          syncedIds: [],
          lastSyncAt: null,
          syncError: null,
        },
      });

      const mockDispatch = jest.fn();
      await processQueue(mockDispatch, mockGetState as any);

      // Should return early without processing
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should process create operations', async () => {
      const mockTask = {
        id: 'task-1',
        companyId: 'company-1',
        text: 'Test task',
      };

      (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);

      const queueItem: SyncQueueItem = {
        id: 'sync-1',
        collection: 'tasks',
        operation: 'create',
        documentId: 'temp_123',
        data: mockTask,
        timestamp: Date.now(),
        retryCount: 0,
      };

      const mockGetState = () => ({
        offline: {
          queue: [queueItem],
          isSyncing: false,
          isOnline: true,
          failedItems: [],
          syncedIds: [],
          lastSyncAt: null,
          syncError: null,
        },
      });

      const mockDispatch = jest.fn();

      await processQueue(mockDispatch, mockGetState as any);

      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // setSyncing(true)
    });
  });
});
