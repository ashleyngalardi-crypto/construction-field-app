import React from 'react';
import { useRouter } from 'expo-router';
import { PhoneAuthScreen } from '../../src/screens/auth/PhoneAuthScreen';

export default function PhoneAuthScreenPage() {
  const router = useRouter();

  return (
    <PhoneAuthScreen
      onSubmit={(phoneNumber) => {
        router.push({
          pathname: '/auth/sms-verification',
          params: { phoneNumber },
        });
      }}
      onBack={() => router.back()}
    />
  );
}
