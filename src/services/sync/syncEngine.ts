import { SyncQueueItem } from '../../types';
import { AppDispatch, RootState } from '../../store';
import {
  removeFromQueue,
  markItemFailed,
  setSyncing,
  updateLastSyncTime,
  incrementRetryCount,
} from '../../store/slices/offlineSlice';
import * as taskService from '../api/taskService';
import * as formService from '../api/formService';
import * as crewService from '../api/crewService';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second between retries

/**
 * Process sync queue - called when device comes online or by middleware
 */
export async function processQueue(
  dispatch: AppDispatch,
  getState?: () => RootState
): Promise<void> {
  // Get current state if not provided
  const state = getState?.();
  if (!state) return;

  const { queue, isSyncing, isOnline } = state.offline;

  // Don't sync if already syncing, queue is empty, or offline
  if (isSyncing || queue.length === 0 || !isOnline) {
    return;
  }

  dispatch(setSyncing(true));

  try {
    // Process queue items sequentially (FIFO)
    const queueCopy = [...queue];

    for (const item of queueCopy) {
      try {
        await processSingleItem(item);
        dispatch(removeFromQueue(item.id));
      } catch (error: any) {
        const errorMessage = error?.message || 'Unknown error';

        if (item.retryCount >= MAX_RETRIES) {
          // Max retries exceeded - move to failed
          dispatch(
            markItemFailed({
              id: item.id,
              error: `Failed after ${MAX_RETRIES} retries: ${errorMessage}`,
            })
          );
        } else {
          // Retry later
          dispatch(incrementRetryCount(item.id));

          // Wait before next retry
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    dispatch(updateLastSyncTime());
  } finally {
    dispatch(setSyncing(false));
  }
}

/**
 * Process a single queue item
 */
async function processSingleItem(item: SyncQueueItem): Promise<void> {
  // Route to correct service based on collection
  switch (item.collection) {
    case 'tasks':
      return processTaskOperation(item);
    case 'formTemplates':
      return processFormTemplateOperation(item);
    case 'formSubmissions':
      return processFormSubmissionOperation(item);
    case 'crew':
      return processCrewOperation(item);
    default:
      throw new Error(`Unknown collection: ${item.collection}`);
  }
}

/**
 * Process task operations
 */
async function processTaskOperation(item: SyncQueueItem): Promise<void> {
  const { operation, documentId, data } = item;

  switch (operation) {
    case 'create':
      // Create operation was optimistic - actual creation happens here
      await taskService.createTask(data.companyId, data);
      break;

    case 'update':
      await taskService.updateTask(documentId, data);
      break;

    case 'delete':
      await taskService.deleteTask(documentId);
      break;

    default:
      throw new Error(`Unknown task operation: ${operation}`);
  }
}

/**
 * Process form template operations
 */
async function processFormTemplateOperation(item: SyncQueueItem): Promise<void> {
  const { operation, documentId, data } = item;

  switch (operation) {
    case 'create':
      await formService.createFormTemplate(data.companyId, data);
      break;

    case 'update':
      await formService.updateFormTemplate(documentId, data);
      break;

    case 'delete':
      // Note: formService uses deleteFormTemplate but it's not in the current implementation
      // May need to add this method
      console.warn('Delete form template not yet implemented');
      break;

    default:
      throw new Error(`Unknown form template operation: ${operation}`);
  }
}

/**
 * Process form submission operations
 */
async function processFormSubmissionOperation(item: SyncQueueItem): Promise<void> {
  const { operation, data } = item;

  switch (operation) {
    case 'create':
      // Form submissions are write-only, no updates/deletes
      await formService.submitForm(data.companyId, data);
      break;

    default:
      throw new Error(`Form submissions only support create operation: ${operation}`);
  }
}

/**
 * Process crew operations
 */
async function processCrewOperation(item: SyncQueueItem): Promise<void> {
  const { operation, documentId, data } = item;

  switch (operation) {
    case 'create':
      await crewService.addCrewMember(data.companyId, data);
      break;

    case 'update':
      await crewService.updateCrewMember(documentId, data);
      break;

    case 'delete':
      await crewService.removeCrewMember(documentId);
      break;

    default:
      throw new Error(`Unknown crew operation: ${operation}`);
  }
}

/**
 * Check if an item should be synced
 */
export function shouldRetryItem(item: SyncQueueItem): boolean {
  return item.retryCount < MAX_RETRIES;
}

/**
 * Get queue stats for UI display
 */
export function getQueueStats(queue: SyncQueueItem[]): {
  pending: number;
  retrying: number;
} {
  let pending = 0;
  let retrying = 0;

  queue.forEach((item) => {
    if (item.retryCount === 0) {
      pending++;
    } else {
      retrying++;
    }
  });

  return { pending, retrying };
}
