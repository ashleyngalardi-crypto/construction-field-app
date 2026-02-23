import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import { store, persistor } from './store';
import RootNavigator from './navigation/RootNavigator';

// Keep splash screen visible until we're ready
SplashScreen.preventAutoHideAsync();

const AppContent: React.FC = () => {
  useEffect(() => {
    // Hide splash screen once Redux state is rehydrated
    SplashScreen.hideAsync();
  }, []);

  return <RootNavigator />;
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
