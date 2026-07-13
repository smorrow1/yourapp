import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAppReady } from '@/lib/bootstrap';
import { RootNavigator } from '@/navigation/RootNavigator';

function AppContent() {
  const ready = useAppReady();

  // Native splash stays visible until persisted state has hydrated.
  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default function App() {
  // ErrorBoundary wraps the hydration phase too, so an early crash still shows the fallback.
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
