import {
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  RecaptchaVerifier,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
// @ts-ignore - expo-secure-store may not have TypeScript declarations
import * as SecureStore from 'expo-secure-store';
// @ts-ignore - expo-crypto may not have TypeScript declarations
import * as Crypto from 'expo-crypto';

export interface AuthUser {
  id: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  role: 'crew' | 'admin';
  createdAt: number;
  lastSignIn: number;
}

let verificationId: string = '';
let confirmationResult: any = null;

/**
 * Phone authentication - Step 1: Send verification code
 */
export const sendPhoneVerificationCode = async (
  phoneNumber: string,
  recaptchaVerifier?: RecaptchaVerifier
): Promise<string> => {
  try {
    // In React Native, Firebase handles SMS verification natively
    // We need to use PhoneAuthProvider with native methods

    // For development/testing: return a test verification ID
    // In production, this would be handled by React Native Firebase module
    verificationId = `test_${Date.now()}`;
    console.log('Phone verification code sent to:', phoneNumber);

    return verificationId;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

/**
 * Phone authentication - Step 2: Verify code
 */
export const verifyPhoneCode = async (
  code: string
): Promise<{ user: AuthUser; idToken: string }> => {
  try {
    if (!verificationId) {
      throw new Error('No verification ID. Send code first.');
    }

    // For development/testing: accept any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      throw new Error('Invalid verification code format');
    }

    // Create a test credential (in production, use PhoneAuthProvider.credential)
    // For actual implementation, you'd need React Native Firebase
    const testUser: AuthUser = {
      id: `user_${Date.now()}`,
      phoneNumber: '+1234567890', // Should be actual phone from verification
      role: 'crew',
      createdAt: Date.now(),
      lastSignIn: Date.now(),
    };

    const testIdToken = `test_token_${Date.now()}`;

    return {
      user: testUser,
      idToken: testIdToken,
    };
  } catch (error) {
    console.error('Error verifying phone code:', error);
    throw error;
  }
};

/**
 * Email/Password authentication
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: AuthUser; idToken: string }> => {
  try {
    // In production, use Firebase Auth
    // const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // const user = userCredential.user;

    // For development/testing
    const testUser: AuthUser = {
      id: `user_${Date.now()}`,
      email,
      role: 'admin',
      createdAt: Date.now(),
      lastSignIn: Date.now(),
    };

    const testIdToken = `test_token_${Date.now()}`;

    return {
      user: testUser,
      idToken: testIdToken,
    };
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * PIN Hashing - Hash PIN for storage
 */
export const hashPin = async (pin: string): Promise<string> => {
  try {
    const hashedPin = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin
    );
    return hashedPin;
  } catch (error) {
    console.error('Error hashing PIN:', error);
    throw error;
  }
};

/**
 * PIN Verification - Verify entered PIN against hash
 */
export const verifyPin = async (
  enteredPin: string,
  storedHash: string
): Promise<boolean> => {
  try {
    const enteredHash = await hashPin(enteredPin);
    return enteredHash === storedHash;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    throw error;
  }
};

/**
 * Store PIN securely
 */
export const storePinSecurely = async (
  userId: string,
  pin: string
): Promise<void> => {
  try {
    const hashedPin = await hashPin(pin);
    // Store hashed PIN in secure storage
    const secureKey = `pin_${userId}`;
    await SecureStore.setItemAsync(secureKey, hashedPin);
  } catch (error) {
    console.error('Error storing PIN:', error);
    throw error;
  }
};

/**
 * Retrieve PIN hash from secure storage
 */
export const retrieveStoredPinHash = async (userId: string): Promise<string | null> => {
  try {
    const secureKey = `pin_${userId}`;
    const storedHash = await SecureStore.getItemAsync(secureKey);
    return storedHash || null;
  } catch (error) {
    console.error('Error retrieving PIN:', error);
    return null;
  }
};

/**
 * Authenticate with PIN
 */
export const authenticateWithPin = async (
  userId: string,
  enteredPin: string
): Promise<boolean> => {
  try {
    const storedHash = await retrieveStoredPinHash(userId);
    if (!storedHash) {
      throw new Error('No PIN stored for this user');
    }

    return await verifyPin(enteredPin, storedHash);
  } catch (error) {
    console.error('Error authenticating with PIN:', error);
    return false;
  }
};

/**
 * Save user to Firestore
 */
export const saveUserToFirestore = async (user: AuthUser): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

/**
 * Get user from Firestore
 */
export const getUserFromFirestore = async (userId: string): Promise<AuthUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as AuthUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    return null;
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const listenToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
