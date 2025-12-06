import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContextProvider, useSession } from '../hooks/useSession';
import { supabase } from '../server/supabase';
import "./../global.css";

export default function RootLayout() {
    const colorScheme = useColorScheme();

  return (
    <AuthContextProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider className='flex-1'>
      <RootLayoutNav />
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
    </AuthContextProvider>
  );
}



function RootLayoutNav() {
  const { session, loading } = useSession();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      supabase.auth[state === 'active' ? 'startAutoRefresh' : 'stopAutoRefresh']();
    });
    return () => subscription.remove();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="(app)" />
      ) : (
        <Stack.Screen name="(app)" />
      )}
    </Stack>
  );
}