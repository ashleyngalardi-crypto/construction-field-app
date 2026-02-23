import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import { store, persistor } from './store';
import { initNetworkMonitor } from './services/sync/networkMonitor';
import RootNavigator from './navigation/RootNavigator';
import { OfflineBanner } from './components/common/OfflineBanner';

// Keep splash screen visible until we're ready
SplashScreen.preventAutoHideAsync();

const AppContent: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Hide splash screen once Redux state is rehydrated
    SplashScreen.hideAsync();

    // Initialize network monitoring for offline sync
    initNetworkMonitor(dispatch);
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <RootNavigator />
    </View>
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
