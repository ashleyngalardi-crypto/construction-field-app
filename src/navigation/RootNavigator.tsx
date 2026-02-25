import React from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { COLORS, SPACING } from '../theme';

// Import navigators
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

// Linking configuration for web support
const linking: LinkingOptions<any> = {
  prefixes: ['/'],
  config: {
    screens: {
      Auth: 'auth',
      Main: 'main',
    },
  },
};

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Native - use full navigation stack
  if (Platform.OS !== 'web') {
    return (
      <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            // Auth Stack
            <Stack.Group>
              <Stack.Screen
                name="Auth"
                component={AuthNavigator}
              />
            </Stack.Group>
          ) : (
            // Main Stack
            <Stack.Group>
              <Stack.Screen
                name="Main"
                component={MainNavigator}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Web - render screens directly without NavigationContainer
  // (Navigation buttons won't work perfectly, but UI will display)
  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default RootNavigator;
