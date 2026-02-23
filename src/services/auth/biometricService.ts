// @ts-ignore - expo-local-authentication may not have TypeScript declarations
import * as LocalAuthentication from 'expo-local-authentication';
// @ts-ignore - expo-secure-store may not have TypeScript declarations
import * as SecureStore from 'expo-secure-store';

export type BiometricType = 'fingerprint' | 'faceId' | 'iris';

export interface BiometricStatus {
  available: boolean;
  enrolled: boolean;
  supportedTypes: BiometricType[];
  hasBiometricPin: boolean;
}

/**
 * Check if biometric authentication is available on device
 */
export const checkBiometricAvailability = async (): Promise<BiometricStatus> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();

    if (!compatible) {
      return {
        available: false,
        enrolled: false,
        supportedTypes: [],
        hasBiometricPin: false,
      };
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedAuthenticationTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Map Firebase types to our types
    const supportedTypes: BiometricType[] = [];
    if (supportedAuthenticationTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      supportedTypes.push('fingerprint');
    }
    if (supportedAuthenticationTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      supportedTypes.push('faceId');
    }
    if (supportedAuthenticationTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      supportedTypes.push('iris');
    }

    return {
      available: compatible,
      enrolled,
      supportedTypes,
      hasBiometricPin: false,
    };
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return {
      available: false,
      enrolled: false,
      supportedTypes: [],
      hasBiometricPin: false,
    };
  }
};

/**
 * Authenticate with biometric
 */
export const authenticateWithBiometric = async (
  reason: string = 'Unlock the app'
): Promise<boolean> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      throw new Error('Biometric hardware not available');
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      throw new Error('No biometric data enrolled');
    }

    const result = await LocalAuthentication.authenticateAsync({
      disableDeviceFallback: false, // Allow PIN fallback
      reason,
      fallbackLabel: 'Use PIN instead',
    });

    return result.success;
  } catch (error) {
    console.error('Error authenticating with biometric:', error);
    return false;
  }
};

/**
 * Enable biometric for user
 */
export const enableBiometricForUser = async (userId: string): Promise<boolean> => {
  try {
    const status = await checkBiometricAvailability();

    if (!status.available || !status.enrolled) {
      throw new Error('Biometric not available or not enrolled');
    }

    // Authenticate first to confirm
    const authenticated = await authenticateWithBiometric('Enable biometric authentication');

    if (!authenticated) {
      throw new Error('Biometric authentication failed');
    }

    // Store biometric preference
    const biometricKey = `biometric_enabled_${userId}`;
    await SecureStore.setItemAsync(biometricKey, 'true');

    return true;
  } catch (error) {
    console.error('Error enabling biometric:', error);
    return false;
  }
};

/**
 * Disable biometric for user
 */
export const disableBiometricForUser = async (userId: string): Promise<boolean> => {
  try {
    const biometricKey = `biometric_enabled_${userId}`;
    await SecureStore.deleteItemAsync(biometricKey);
    return true;
  } catch (error) {
    console.error('Error disabling biometric:', error);
    return false;
  }
};

/**
 * Check if biometric is enabled for user
 */
export const isBiometricEnabledForUser = async (userId: string): Promise<boolean> => {
  try {
    const biometricKey = `biometric_enabled_${userId}`;
    const enabled = await SecureStore.getItemAsync(biometricKey);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking biometric status:', error);
    return false;
  }
};

/**
 * Get biometric-friendly label
 */
export const getBiometricLabel = async (): Promise<string> => {
  try {
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID';
    }
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris Scan';
    }

    return 'Biometric';
  } catch (error) {
    console.error('Error getting biometric label:', error);
    return 'Biometric';
  }
};
