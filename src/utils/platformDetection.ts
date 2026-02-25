import { Platform } from 'react-native';

/**
 * Detect if app is running on web platform
 */
export const isWeb = Platform.OS === 'web';

/**
 * Detect if app is running on native mobile platform
 */
export const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Detect if app is running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Detect if app is running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Get platform name for debugging
 */
export const getPlatformName = (): string => {
  if (isWeb) return 'Web';
  if (isIOS) return 'iOS';
  if (isAndroid) return 'Android';
  return Platform.OS;
};

/**
 * Check if platform supports camera hardware
 */
export const supportsCameraHardware = (): boolean => {
  return isNative;
};

/**
 * Check if platform supports file system access
 */
export const supportsFileSystem = (): boolean => {
  return isNative;
};

/**
 * Check if platform supports location services
 */
export const supportsLocationServices = (): boolean => {
  return isNative;
};

/**
 * Check if platform supports biometric authentication
 */
export const supportsBiometrics = (): boolean => {
  return isNative;
};

/**
 * Conditionally import modules based on platform
 */
export const getPlatformModule = (moduleName: string) => {
  if (isWeb) {
    console.warn(`Platform module '${moduleName}' not available on web`);
    return null;
  }
  return moduleName;
};

/**
 * Device dimensions - responsive to window size on web
 */
export const getDeviceDimensions = () => {
  if (isWeb) {
    return {
      width: typeof window !== 'undefined' ? window.innerWidth : 1024,
      height: typeof window !== 'undefined' ? window.innerHeight : 768,
    };
  }

  const { Dimensions } = require('react-native');
  return Dimensions.get('window');
};

/**
 * Platform-specific alert fallback
 */
export const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (isWeb) {
    // On web, use native alert dialog
    alert(`${title}\n\n${message}`);
    onOk?.();
  } else {
    // On native, use React Native Alert
    const { Alert } = require('react-native');
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};
