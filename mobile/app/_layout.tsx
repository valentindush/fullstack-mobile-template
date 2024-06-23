import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/utils/providers/auth.provider';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function useProtectedRoute(user: any | null, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isAuthGroup = segments[0] === '(auth)';
      const isAuthRoute = ['login', 'register'].includes(segments[segments.length - 1]);

      if (user && isAuthRoute) {
        // Redirect to the home page if the user is signed in and trying to access auth pages
        router.replace('/');
      } else if (!user && !isAuthRoute) {
        // Redirect to the login page if the user is not signed in and trying to access app pages
        router.replace('/login');
      }
    }
  }, [user, isLoading, segments]);
}

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  useProtectedRoute(user, isLoading);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1 }}
    >
      <StatusBar
        backgroundColor='#615EFC'
        style={'light'}
      />
      <Stack screenOptions={{
        headerShown: false
      }}>
      </Stack>
      <Toast />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}