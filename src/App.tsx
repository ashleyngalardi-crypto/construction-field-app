import React, { useEffect, useRef } from 'react';
import { View, Platform, Text } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import { store, persistor } from './store';
import { initNetworkMonitor } from './services/sync/networkMonitor';
import RootNavigator from './navigation/RootNavigator';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer, ToastContainerHandle, setToastRef } from './components/common/Toast';

// Keep splash screen visible until we're ready (native only)
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const toastRef = useRef<ToastContainerHandle>(null);

  useEffect(() => {
    // Set global toast reference
    if (toastRef.current) {
      setToastRef(toastRef);
    }

    // Hide splash screen once Redux state is rehydrated (native only)
    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {
        // Ignore errors on web
      });
    }

    // Initialize network monitoring for offline sync
    initNetworkMonitor(dispatch);
  }, [dispatch]);

  // On web, use a try-catch to handle any navigation errors gracefully
  if (Platform.OS === 'web') {
    return (
      <ErrorBoundary>
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <OfflineBanner />
          <View style={{ flex: 1 }}>
            <RootNavigator />
          </View>
          <ToastContainer ref={toastRef} />
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <OfflineBanner />
        <RootNavigator />
        <ToastContainer ref={toastRef} />
      </View>
    </ErrorBoundary>
  );
};

const PersistLoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
    <Text style={{ fontSize: 18, color: '#666' }}>Loading app...</Text>
  </View>
);

export default function App() {
  // On web, skip PersistGate to avoid rehydration issues
  if (Platform.OS === 'web') {
    return (
      <Provider store={store}>
        <AppContent />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoadingScreen />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
