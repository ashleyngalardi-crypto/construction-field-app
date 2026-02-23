import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

// Auth screens
import { RoleSelectScreen } from '../screens/auth/RoleSelectScreen';
import { PhoneAuthScreen } from '../screens/auth/PhoneAuthScreen';
import { SmsVerificationScreen } from '../screens/auth/SmsVerificationScreen';
import { AdminLoginScreen } from '../screens/auth/AdminLoginScreen';
import { PinSetupScreen } from '../screens/auth/PinSetupScreen';
import { PinLockScreen } from '../screens/auth/PinLockScreen';

export type AuthStackParamList = {
  RoleSelect: undefined;
  PhoneAuth: undefined;
  SmsVerification: { phoneNumber: string };
  AdminLogin: undefined;
  PinSetup: { role: 'crew' | 'admin'; phoneNumber?: string; email?: string };
  PinLock: { userName?: string };
};

type RoleSelectProps = NativeStackScreenProps<AuthStackParamList, 'RoleSelect'>;
type PhoneAuthProps = NativeStackScreenProps<AuthStackParamList, 'PhoneAuth'>;
type SmsVerificationProps = NativeStackScreenProps<AuthStackParamList, 'SmsVerification'>;
type AdminLoginProps = NativeStackScreenProps<AuthStackParamList, 'AdminLogin'>;
type PinSetupProps = NativeStackScreenProps<AuthStackParamList, 'PinSetup'>;
type PinLockProps = NativeStackScreenProps<AuthStackParamList, 'PinLock'>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Screen wrapper components that inject navigation
const RoleSelectWrapper: React.FC<RoleSelectProps> = ({ navigation }) => (
  <RoleSelectScreen
    onSelectRole={(role) => {
      if (role === 'crew') {
        navigation.navigate('PhoneAuth' as any);
      } else {
        navigation.navigate('AdminLogin' as any);
      }
    }}
  />
);

const PhoneAuthWrapper: React.FC<PhoneAuthProps> = ({ navigation }) => (
  <PhoneAuthScreen
    onSubmit={(phoneNumber) => {
      navigation.navigate('SmsVerification', { phoneNumber });
    }}
    onBack={() => navigation.goBack()}
  />
);

const SmsVerificationWrapper: React.FC<SmsVerificationProps> = ({
  navigation,
  route,
}) => (
  <SmsVerificationScreen
    phoneNumber={route.params.phoneNumber}
    onSubmit={(_code) => {
      navigation.navigate('PinSetup', {
        role: 'crew',
        phoneNumber: route.params.phoneNumber,
      });
    }}
    onBack={() => navigation.goBack()}
    onResend={() => {
      // TODO: Implement SMS resend logic
    }}
  />
);

const AdminLoginWrapper: React.FC<AdminLoginProps> = ({ navigation }) => (
  <AdminLoginScreen
    onSubmit={(email, _password) => {
      navigation.navigate('PinSetup', {
        role: 'admin',
        email,
      });
    }}
    onBack={() => navigation.goBack()}
  />
);

const PinSetupWrapper: React.FC<PinSetupProps> = ({ navigation }) => (
  <PinSetupScreen
    onSetup={(_pin) => {
      navigation.navigate('PinLock' as any);
    }}
    onBack={() => navigation.goBack()}
  />
);

const PinLockWrapper: React.FC<PinLockProps> = () => (
  <PinLockScreen
    userName="User"
    onUnlock={(_pin) => {
      // TODO: Verify PIN and authenticate user
    }}
    onBiometric={() => {
      // TODO: Implement biometric authentication
    }}
    biometricAvailable={true}
  />
);

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="RoleSelect"
        component={RoleSelectWrapper}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen
        name="PhoneAuth"
        component={PhoneAuthWrapper}
      />
      <Stack.Screen
        name="SmsVerification"
        component={SmsVerificationWrapper}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLoginWrapper}
      />
      <Stack.Screen
        name="PinSetup"
        component={PinSetupWrapper}
      />
      <Stack.Screen
        name="PinLock"
        component={PinLockWrapper}
      />
    </Stack.Navigator>
  );
};
