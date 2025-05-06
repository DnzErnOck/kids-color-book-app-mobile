import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

// Ana sayfaya yönlendir
export function HomeRedirect() {
  return <Redirect href="/" />;
}
