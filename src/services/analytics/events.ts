/**
 * Analytics event constants for tracking user actions
 * Use these throughout the app for consistent event tracking
 */

export const EVENTS = {
  // Authentication events
  AUTH_LOGIN_STARTED: 'auth_login_started',
  AUTH_LOGIN_SUCCESS: 'auth_login_success',
  AUTH_LOGIN_FAILED: 'auth_login_failed',
  AUTH_LOGOUT: 'auth_logout',
  AUTH_PIN_SETUP: 'auth_pin_setup',
  AUTH_BIOMETRIC_ENABLED: 'auth_biometric_enabled',

  // Task events
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_COMPLETED: 'task_completed',
  TASK_DELETED: 'task_deleted',
  TASK_ASSIGNED: 'task_assigned',

  // Form events
  FORM_SUBMITTED: 'form_submitted',
  FORM_TEMPLATE_CREATED: 'form_template_created',
  FORM_TEMPLATE_UPDATED: 'form_template_updated',
  FORM_TEMPLATE_DELETED: 'form_template_deleted',

  // Crew events
  CREW_MEMBER_ADDED: 'crew_member_added',
  CREW_MEMBER_UPDATED: 'crew_member_updated',
  CREW_MEMBER_REMOVED: 'crew_member_removed',

  // Inspection events
  INSPECTION_STARTED: 'inspection_started',
  INSPECTION_COMPLETED: 'inspection_completed',
  INSPECTION_FAILED: 'inspection_failed',

  // Offline sync events
  OFFLINE_SYNC_STARTED: 'offline_sync_started',
  OFFLINE_SYNC_SUCCESS: 'offline_sync_success',
  OFFLINE_SYNC_FAILED: 'offline_sync_failed',
  OFFLINE_MODE_ENABLED: 'offline_mode_enabled',
  OFFLINE_QUEUE_SIZE_CHECK: 'offline_queue_size_check',

  // Navigation events
  SCREEN_VIEWED: 'screen_viewed',

  // Error events
  ERROR_OCCURRED: 'error_occurred',
  NETWORK_ERROR: 'network_error',
  DATABASE_ERROR: 'database_error',

  // Performance events
  SCREEN_LOAD_TIME: 'screen_load_time',
  API_CALL_TIME: 'api_call_time',
};

/**
 * Event parameters for rich tracking
 */
export interface TaskEventParams {
  taskId?: string;
  priority?: 'high' | 'medium' | 'low';
  assigneeId?: string;
  status?: string;
}

export interface FormEventParams {
  formId?: string;
  templateType?: string;
  fieldCount?: number;
}

export interface SyncEventParams {
  queueLength?: number;
  successCount?: number;
  failureCount?: number;
  retryCount?: number;
}

export interface ErrorEventParams {
  errorType?: string;
  errorMessage?: string;
  screen?: string;
}
