import * as Haptics from 'expo-haptics';

/**
 * Haptics service for tactile feedback
 * Provides a unified interface for haptic feedback across the app
 */

/**
 * Light impact (button tap)
 */
export const lightHaptic = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Medium impact (form input, list item selection)
 */
export const mediumHaptic = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Heavy impact (destructive action, delete)
 */
export const heavyHaptic = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Success notification (task completed, form submitted)
 */
export const successHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Warning notification (validation error, warning alert)
 */
export const warningHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Error notification (operation failed, error alert)
 */
export const errorHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Selection changed (picker, segmented control)
 */
export const selectionHaptic = async () => {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Grouped haptics for common interactions
 */
export const haptics = {
  tap: lightHaptic,
  select: mediumHaptic,
  delete: heavyHaptic,
  success: successHaptic,
  warning: warningHaptic,
  error: errorHaptic,
  selection: selectionHaptic,
};
