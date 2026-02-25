/**
 * Web-compatible storage adapter for redux-persist
 * Falls back to localStorage on web platform
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

/**
 * localStorage adapter for web
 */
const localStorageAdapter: StorageAdapter = {
  getItem: async (key: string) => {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  setItem: async (key: string, value: string) => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Error writing to localStorage: ${key}`, error);
    }
  },

  removeItem: async (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage: ${key}`, error);
    }
  },
};

/**
 * Select appropriate storage based on platform
 */
const getStorage = (): StorageAdapter => {
  // Use localStorage on web
  if (Platform.OS === 'web') {
    return localStorageAdapter;
  }
  // Use AsyncStorage on native platforms
  return AsyncStorage;
};

export const webCompatibleStorage = getStorage();
