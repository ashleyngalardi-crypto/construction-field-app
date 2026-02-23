import * as Sentry from '@sentry/react-native';
import { RootState } from '../../store';

/**
 * Initialize Sentry for crash reporting and error tracking
 * Call this early in your app's startup (in App.tsx)
 */
export function initSentry() {
  if (__DEV__) {
    // Skip Sentry in development
    console.log('Sentry disabled in development mode');
    return;
  }

  Sentry.init({
    // Replace with your actual Sentry DSN
    dsn: 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID',
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 0.1,
    enableNativeStacktraces: true,
    attachStacktrace: true,
    beforeSend(event, hint) {
      // Filter out certain errors if needed
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error && error.message.includes('Network request failed')) {
          // Log network errors but don't send to Sentry
          return null;
        }
      }
      return event;
    },
  });
}

/**
 * Set user context for Sentry (call after user logs in)
 */
export function setSentryUser(userId: string, userData?: { email?: string; fullName?: string }) {
  Sentry.setUser({
    id: userId,
    email: userData?.email,
    username: userData?.fullName,
  });
}

/**
 * Clear user context (call on logout)
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Add Redux state as context
 */
export function setSentryReduxContext(state: RootState) {
  Sentry.setContext('redux', {
    auth: {
      isAuthenticated: state.auth.isAuthenticated,
      userRole: state.auth.user?.role,
    },
    offline: {
      isOnline: state.offline.isOnline,
      queueLength: state.offline.queue.length,
      failedCount: state.offline.failedItems.length,
    },
  });
}

/**
 * Capture a message for non-error events
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Capture an exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, { extra: context });
}

/**
 * Add a breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, any>,
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level,
  });
}
