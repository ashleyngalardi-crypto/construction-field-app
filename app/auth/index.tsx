import React from 'react';
import { useRouter } from 'expo-router';
import { RoleSelectScreen } from '../../src/screens/auth/RoleSelectScreen';

export default function AuthScreen() {
  const router = useRouter();

  return (
    <RoleSelectScreen
      onSelectRole={(role) => {
        if (role === 'crew') {
          router.push('/auth/phone-auth');
        } else {
          router.push('/auth/admin-login');
        }
      }}
    />
  );
}
