import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { reset, navigateTo, goBack } from '../store/slices/webNavigationSlice';

// Auth screens
import { RoleSelectScreen } from '../screens/auth/RoleSelectScreen';
import { PhoneAuthScreen } from '../screens/auth/PhoneAuthScreen';
import { SmsVerificationScreen } from '../screens/auth/SmsVerificationScreen';
import { PinSetupScreen } from '../screens/auth/PinSetupScreen';
import { PinLockScreen } from '../screens/auth/PinLockScreen';
import { AdminLoginScreen } from '../screens/auth/AdminLoginScreen';

// Main screens (placeholder - implement as needed)
const MainScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 200, height: 200, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ padding: 20 }}>
        <View style={{ width: 150, height: 40, backgroundColor: '#E8601C', borderRadius: 8 }} />
      </View>
    </View>
  </View>
);

/**
 * Web Navigation Container
 * Uses Redux state to manage navigation instead of React Navigation
 * Renders different screens based on the current route stored in Redux
 */
export const WebNavigationContainer: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const currentRoute = useSelector((state: RootState) => state.webNavigation.current);
  const params = useSelector((state: RootState) => state.webNavigation.params);

  // Reset to auth when logout happens
  useEffect(() => {
    if (!isAuthenticated && currentRoute !== 'auth') {
      dispatch(reset('auth'));
    }
  }, [isAuthenticated, currentRoute, dispatch]);

  // Render appropriate screen based on current route
  const renderScreen = () => {
    switch (currentRoute) {
      // Auth flows
      case 'auth':
        return <RoleSelectScreen />;

      case 'phone-auth':
        return (
          <PhoneAuthScreen
            onSubmit={(phoneNumber) => {
              dispatch(navigateTo({ route: 'sms-verification', params: { phoneNumber } }));
            }}
            onBack={() => dispatch(goBack())}
          />
        );

      case 'sms-verification':
        return (
          <SmsVerificationScreen
            phoneNumber={params['sms-verification']?.phoneNumber || ''}
            onVerify={() => {
              dispatch(navigateTo({ route: 'pin-setup' }));
            }}
            onBack={() => dispatch(goBack())}
          />
        );

      case 'pin-setup':
        return (
          <PinSetupScreen
            onComplete={() => {
              dispatch(navigateTo({ route: 'pin-lock' }));
            }}
          />
        );

      case 'pin-lock':
        return (
          <PinLockScreen
            onUnlock={() => {
              dispatch(navigateTo({ route: 'home' }));
            }}
          />
        );

      case 'admin-login':
        return (
          <AdminLoginScreen
            onLogin={() => {
              dispatch(navigateTo({ route: 'admin' }));
            }}
            onBack={() => dispatch(goBack())}
          />
        );

      // Main app
      case 'main':
      case 'home':
      case 'tasks':
      case 'crew':
      case 'admin':
        return <MainScreen />;

      default:
        return <RoleSelectScreen />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

export default WebNavigationContainer;
