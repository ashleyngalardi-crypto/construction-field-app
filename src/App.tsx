import React, { useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';
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

  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        <OfflineBanner />
        <RootNavigator />
        <ToastContainer ref={toastRef} />
      </View>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
