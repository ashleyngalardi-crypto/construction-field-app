import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from '../firebase';
import { EVENTS } from './events';

/**
 * Analytics service wrapper for Firebase Analytics
 * Provides a centralized interface for tracking user events
 */

/**
 * Track a user event
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.warn('Failed to track event:', eventName, error);
  }
};

/**
 * Track screen view
 */
export const trackScreenView = (screenName: string, params?: Record<string, any>) => {
  trackEvent(EVENTS.SCREEN_VIEWED, {
    screen_name: screenName,
    ...params,
  });
};

/**
 * Track task creation
 */
export const trackTaskCreated = (params: { priority?: string; assigneeId?: string }) => {
  trackEvent(EVENTS.TASK_CREATED, params);
};

/**
 * Track task completion
 */
export const trackTaskCompleted = (taskId: string, timeSpent?: number) => {
  trackEvent(EVENTS.TASK_COMPLETED, {
    task_id: taskId,
    time_spent_seconds: timeSpent,
  });
};

/**
 * Track form submission
 */
export const trackFormSubmitted = (params: { templateType?: string; fieldCount?: number }) => {
  trackEvent(EVENTS.FORM_SUBMITTED, params);
};

/**
 * Track offline sync success
 */
export const trackOfflineSyncSuccess = (params: {
  itemCount?: number;
  duration?: number;
  queueLength?: number;
}) => {
  trackEvent(EVENTS.OFFLINE_SYNC_SUCCESS, params);
};

/**
 * Track offline sync failure
 */
export const trackOfflineSyncFailed = (params: {
  itemCount?: number;
  errorMessage?: string;
  queueLength?: number;
}) => {
  trackEvent(EVENTS.OFFLINE_SYNC_FAILED, params);
};

/**
 * Track offline mode enabled
 */
export const trackOfflineModeEnabled = () => {
  trackEvent(EVENTS.OFFLINE_MODE_ENABLED);
};

/**
 * Track login attempt
 */
export const trackLoginAttempt = (method: 'phone' | 'email') => {
  trackEvent(EVENTS.AUTH_LOGIN_STARTED, { method });
};

/**
 * Track login success
 */
export const trackLoginSuccess = (method: 'phone' | 'email', duration?: number) => {
  trackEvent(EVENTS.AUTH_LOGIN_SUCCESS, {
    method,
    duration_ms: duration,
  });
};

/**
 * Track error
 */
export const trackError = (params: {
  errorType?: string;
  errorMessage?: string;
  screen?: string;
}) => {
  trackEvent(EVENTS.ERROR_OCCURRED, params);
};

/**
 * Set user properties
 */
export const setAnalyticsUser = (userId: string, properties?: Record<string, any>) => {
  try {
    setUserProperties(analytics, {
      user_id: userId,
      ...properties,
    });
  } catch (error) {
    console.warn('Failed to set user properties:', error);
  }
};

/**
 * Track performance metrics
 */
export const trackPerformance = (
  eventName: string,
  durationMs: number,
  params?: Record<string, any>
) => {
  trackEvent(eventName, {
    duration_ms: durationMs,
    ...params,
  });
};
