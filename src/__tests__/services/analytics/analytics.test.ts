import {
  trackEvent,
  trackScreenView,
  trackTaskCreated,
  trackTaskCompleted,
  trackFormSubmitted,
  trackOfflineSyncSuccess,
  trackOfflineSyncFailed,
  trackLoginAttempt,
  trackLoginSuccess,
  trackError,
} from '../../../services/analytics/analytics';
import { EVENTS } from '../../../services/analytics/events';
import * as firebaseAnalytics from 'firebase/analytics';

jest.mock('firebase/analytics');

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tracks generic event', () => {
    trackEvent(EVENTS.TASK_CREATED, { taskId: 'task123' });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.TASK_CREATED,
      { taskId: 'task123' }
    );
  });

  it('tracks screen view event', () => {
    trackScreenView('HomeScreen', { userId: 'user123' });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.SCREEN_VIEWED,
      {
        screen_name: 'HomeScreen',
        userId: 'user123',
      }
    );
  });

  it('tracks task created event', () => {
    trackTaskCreated({ priority: 'high', assigneeId: 'user123' });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.TASK_CREATED,
      { priority: 'high', assigneeId: 'user123' }
    );
  });

  it('tracks task completed event', () => {
    trackTaskCompleted('task123', 300);
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.TASK_COMPLETED,
      { task_id: 'task123', time_spent_seconds: 300 }
    );
  });

  it('tracks form submitted event', () => {
    trackFormSubmitted({ templateType: 'risk', fieldCount: 5 });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.FORM_SUBMITTED,
      { templateType: 'risk', fieldCount: 5 }
    );
  });

  it('tracks offline sync success event', () => {
    trackOfflineSyncSuccess({ itemCount: 10, duration: 2000, queueLength: 0 });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.OFFLINE_SYNC_SUCCESS,
      { itemCount: 10, duration: 2000, queueLength: 0 }
    );
  });

  it('tracks offline sync failed event', () => {
    trackOfflineSyncFailed({
      itemCount: 5,
      errorMessage: 'Network error',
      queueLength: 5,
    });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.OFFLINE_SYNC_FAILED,
      { itemCount: 5, errorMessage: 'Network error', queueLength: 5 }
    );
  });

  it('tracks login attempt event', () => {
    trackLoginAttempt('phone');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.AUTH_LOGIN_STARTED,
      { method: 'phone' }
    );
  });

  it('tracks login success event', () => {
    trackLoginSuccess('email', 1500);
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.AUTH_LOGIN_SUCCESS,
      { method: 'email', duration_ms: 1500 }
    );
  });

  it('tracks error event', () => {
    trackError({
      errorType: 'NetworkError',
      errorMessage: 'Failed to fetch data',
      screen: 'HomeScreen',
    });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.ERROR_OCCURRED,
      {
        errorType: 'NetworkError',
        errorMessage: 'Failed to fetch data',
        screen: 'HomeScreen',
      }
    );
  });

  it('handles missing parameters gracefully', () => {
    trackTaskCreated({});
    expect(firebaseAnalytics.logEvent).toHaveBeenCalled();
  });

  it('tracks event without parameters', () => {
    trackEvent(EVENTS.OFFLINE_MODE_ENABLED);
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(),
      EVENTS.OFFLINE_MODE_ENABLED
    );
  });
});
