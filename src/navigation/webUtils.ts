/**
 * Web Navigation Utilities
 * Redux dispatch helpers for web-based navigation
 */

import { AppDispatch } from '../store';
import { navigateTo, goBack } from '../store/slices/webNavigationSlice';

/**
 * Navigate to a route with optional parameters
 * Usage: webNavigate(dispatch, 'phone-auth')
 */
export const webNavigate = (
  dispatch: AppDispatch,
  route: 'auth' | 'phone-auth' | 'sms-verification' | 'pin-setup' | 'pin-lock' | 'admin-login' | 'main' | 'home' | 'tasks' | 'crew' | 'admin',
  params?: Record<string, any>
) => {
  dispatch(navigateTo({ route, params }));
};

/**
 * Go back to previous route
 */
export const webGoBack = (dispatch: AppDispatch) => {
  dispatch(goBack());
};
