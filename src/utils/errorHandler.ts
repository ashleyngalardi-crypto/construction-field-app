import { showError, showWarning, showSuccess } from '../components/common/Toast';
import { isOnline } from '../services/sync/offlineUtils';

export type ErrorType =
  | 'network'
  | 'offline'
  | 'validation'
  | 'auth'
  | 'permission'
  | 'not_found'
  | 'conflict'
  | 'server'
  | 'unknown';

interface ErrorInfo {
  type: ErrorType;
  message: string;
  userMessage: string;
  statusCode?: number;
}

/**
 * Map error objects to user-friendly messages
 */
export const mapErrorToMessage = (error: any): ErrorInfo => {
  // Handle string errors
  if (typeof error === 'string') {
    return {
      type: 'unknown',
      message: error,
      userMessage: error,
    };
  }

  // Handle Firebase/Firestore errors
  if (error?.code) {
    return mapFirebaseError(error);
  }

  // Handle network errors
  if (error?.message?.includes('Network') || error?.message?.includes('network')) {
    return {
      type: 'network',
      message: error.message,
      userMessage: 'Network error. Please check your connection.',
      statusCode: 0,
    };
  }

  // Handle validation errors
  if (error?.message?.includes('validation') || error?.message?.includes('required')) {
    return {
      type: 'validation',
      message: error.message,
      userMessage: error.message || 'Please check your input and try again.',
    };
  }

  // Handle authentication errors
  if (error?.message?.includes('auth') || error?.message?.includes('unauthorized')) {
    return {
      type: 'auth',
      message: error.message,
      userMessage: 'Authentication failed. Please log in again.',
    };
  }

  // Handle permission errors
  if (error?.message?.includes('permission') || error?.message?.includes('forbidden')) {
    return {
      type: 'permission',
      message: error.message,
      userMessage: 'You do not have permission to perform this action.',
    };
  }

  // Handle not found errors
  if (error?.message?.includes('not found') || error?.message?.includes('404')) {
    return {
      type: 'not_found',
      message: error.message,
      userMessage: 'The requested resource was not found.',
      statusCode: 404,
    };
  }

  // Handle conflict errors
  if (error?.message?.includes('conflict') || error?.message?.includes('409')) {
    return {
      type: 'conflict',
      message: error.message,
      userMessage: 'A conflict occurred. Please try again or contact support.',
      statusCode: 409,
    };
  }

  // Default: unknown error
  return {
    type: 'unknown',
    message: error?.message || 'An unknown error occurred',
    userMessage: 'Something went wrong. Please try again.',
  };
};

/**
 * Map Firebase-specific errors
 */
const mapFirebaseError = (error: any): ErrorInfo => {
  const code = error.code || '';

  const firebaseErrors: { [key: string]: { type: ErrorType; message: string } } = {
    'auth/invalid-email': {
      type: 'validation',
      message: 'Invalid email address',
    },
    'auth/user-not-found': {
      type: 'auth',
      message: 'User not found. Please sign up.',
    },
    'auth/wrong-password': {
      type: 'auth',
      message: 'Incorrect password',
    },
    'auth/too-many-requests': {
      type: 'auth',
      message: 'Too many login attempts. Try again later.',
    },
    'auth/user-disabled': {
      type: 'auth',
      message: 'Your account has been disabled.',
    },
    'permission-denied': {
      type: 'permission',
      message: 'You do not have permission to access this.',
    },
    'not-found': {
      type: 'not_found',
      message: 'Resource not found',
    },
    'unavailable': {
      type: 'server',
      message: 'Service temporarily unavailable',
    },
  };

  const errorInfo = firebaseErrors[code];
  if (errorInfo) {
    return {
      ...errorInfo,
      userMessage: errorInfo.message,
    };
  }

  return {
    type: 'server',
    message: error.message || 'Firebase error occurred',
    userMessage: 'A server error occurred. Please try again.',
  };
};

/**
 * Handle and display error with automatic offline detection
 */
export const handleError = (error: any, context?: string): ErrorInfo => {
  const errorInfo = mapErrorToMessage(error);

  // Add offline context if applicable
  if (!isOnline()) {
    errorInfo.userMessage = `Offline: ${errorInfo.userMessage}`;
    errorInfo.type = 'offline';
  }

  // Log for debugging
  console.error(`[${context || 'Error'}]`, {
    type: errorInfo.type,
    message: errorInfo.message,
    userMessage: errorInfo.userMessage,
    original: error,
  });

  // Show user message
  showError(errorInfo.userMessage);

  return errorInfo;
};

/**
 * Handle and display warning
 */
export const handleWarning = (message: string, context?: string) => {
  console.warn(`[${context || 'Warning'}] ${message}`);
  showWarning(message);
};

/**
 * Handle success message
 */
export const handleSuccess = (message: string, context?: string) => {
  console.log(`[${context || 'Success'}] ${message}`);
  showSuccess(message);
};

/**
 * Validate form field
 */
export const validateField = (
  value: any,
  fieldName: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  }
): string | null => {
  // Required field
  if (rules.required) {
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      return `${fieldName} is required`;
    }
  }

  // Min length
  if (rules.minLength && value?.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  // Max length
  if (rules.maxLength && value?.length > rules.maxLength) {
    return `${fieldName} must not exceed ${rules.maxLength} characters`;
  }

  // Pattern (regex)
  if (rules.pattern && !rules.pattern.test(value)) {
    return `${fieldName} format is invalid`;
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value);
    if (result !== true) {
      return typeof result === 'string' ? result : `${fieldName} is invalid`;
    }
  }

  return null;
};

/**
 * Validate multiple fields at once
 */
export const validateForm = (
  formData: Record<string, any>,
  schema: Record<string, Parameters<typeof validateField>[2]>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.entries(schema).forEach(([fieldName, rules]) => {
    const error = validateField(formData[fieldName], fieldName, rules);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Get error summary for displaying multiple field errors
 */
export const getErrorSummary = (errors: Record<string, string>): string => {
  const errorMessages = Object.values(errors).filter((msg) => msg);
  if (errorMessages.length === 0) return '';
  if (errorMessages.length === 1) return errorMessages[0];
  return `Please fix ${errorMessages.length} errors`;
};
