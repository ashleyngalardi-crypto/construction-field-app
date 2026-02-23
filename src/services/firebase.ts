import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyDemoKeyForDevelopment123',
  authDomain: 'construction-field-app.firebaseapp.com',
  projectId: 'construction-field-app',
  storageBucket: 'construction-field-app.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123def456',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence only available in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

// Recaptcha verifier for phone authentication (web only)
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const getRecaptchaVerifier = (containerId?: string) => {
  // In React Native, Recaptcha is handled differently
  // Firebase will use native SMS verification
  return null;
};

export default {
  app,
  auth,
  db,
  storage,
};
