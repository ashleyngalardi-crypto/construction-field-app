import * as Sentry from '@sentry/react-native';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDev = __DEV__;

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
    if (context) {
      Sentry.captureMessage(message, 'warning');
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.log('error', message, context);

    if (error instanceof Error) {
      Sentry.captureException(error, { extra: context });
    } else if (error) {
      Sentry.captureException(new Error(String(error)), { extra: context });
    } else {
      Sentry.captureMessage(message, 'error');
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';

    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;

    switch (level) {
      case 'debug':
        if (this.isDev) console.log(logMessage);
        break;
      case 'info':
        console.log(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
    }
  }

  /**
   * Add breadcrumb for tracking user actions
   */
  breadcrumb(message: string, category: string, data?: LogContext) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    });
  }
}

export const logger = new Logger();
