import { logger } from '../../../services/monitoring/logger';
import * as Sentry from '@sentry/react-native';

jest.mock('@sentry/react-native');

describe('Logger Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs debug messages', () => {
    logger.debug('Debug message', { key: 'value' });
    expect(console.log).toHaveBeenCalled();
  });

  it('logs info messages', () => {
    logger.info('Info message', { userId: '123' });
    expect(console.log).toHaveBeenCalled();
  });

  it('logs warning messages', () => {
    logger.warn('Warning message', { warning: 'test' });
    expect(console.warn).toHaveBeenCalled();
    // Warnings should also add breadcrumb to Sentry
    expect(Sentry.addBreadcrumb).toHaveBeenCalled();
  });

  it('logs error messages', () => {
    const error = new Error('Test error');
    logger.error('Error message', { error });
    expect(console.error).toHaveBeenCalled();
  });

  it('sends error to Sentry when error level is logged', () => {
    const error = new Error('Sentry error');
    logger.error('An error occurred', { error });
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it('adds breadcrumbs for tracking user actions', () => {
    logger.info('User clicked button', { buttonId: 'submit' });
    expect(Sentry.addBreadcrumb).toHaveBeenCalled();
  });

  it('handles logging without context data', () => {
    logger.info('Simple message');
    expect(console.log).toHaveBeenCalled();
  });

  it('handles logging with nested context data', () => {
    logger.info('Complex message', {
      user: { id: '123', name: 'John' },
      action: 'login',
    });
    expect(console.log).toHaveBeenCalled();
  });

  it('logs to console with correct format', () => {
    const message = 'Test message';
    const context = { key: 'value' };
    logger.info(message, context);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('INFO'),
      expect.objectContaining(context)
    );
  });

  it('handles warning-level logs', () => {
    logger.warn('Warning', { severity: 'medium' });
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      level: 'warning',
      message: 'Warning',
      data: { severity: 'medium' },
    });
  });
});
