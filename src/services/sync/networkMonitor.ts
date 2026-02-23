import { useEffect } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineStatus } from '../../store/slices/offlineSlice';
import { RootState } from '../../store';
import { processQueue } from './syncEngine';

let appStateSubscription: any = null;
let netInfoUnsubscribe: (() => void) | null = null;

/**
 * Initialize network monitoring
 * Call this once in app root (App.tsx or RootNavigator)
 */
export function initNetworkMonitor(dispatch: any) {
  // Initial network check
  NetInfo.fetch().then((state) => {
    const isOnline = (state.isConnected && state.isInternetReachable) ?? false;
    dispatch(setOnlineStatus(isOnline));
  });

  // Subscribe to network changes
  netInfoUnsubscribe = NetInfo.addEventListener((state) => {
    const isOnline = (state.isConnected && state.isInternetReachable) ?? false;
    dispatch(setOnlineStatus(isOnline));

    // Trigger sync when coming online
    if (isOnline) {
      processQueue(dispatch);
    }
  });

  // Listen for app state changes (background/foreground)
  appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      // App came to foreground - trigger sync
      NetInfo.fetch().then((state) => {
        const isOnline = (state.isConnected && state.isInternetReachable) ?? false;
        if (isOnline) {
          processQueue(dispatch);
        }
      });
    }
  });
}

/**
 * Clean up network monitoring
 * Call this on app shutdown if needed
 */
export function cleanupNetworkMonitor() {
  netInfoUnsubscribe?.();
  appStateSubscription?.remove();
}

/**
 * Hook to get current network status and trigger sync
 */
export function useNetworkStatus() {
  const dispatch = useDispatch();
  const { isOnline, queue } = useSelector((state: RootState) => state.offline);

  useEffect(() => {
    initNetworkMonitor(dispatch);
    return () => cleanupNetworkMonitor();
  }, []);

  return {
    isOnline,
    hasQueue: queue.length > 0,
    queueLength: queue.length,
  };
}
