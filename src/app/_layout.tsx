import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { AuthContextProvider, useSession } from '../hooks/useSession';
import { supabase } from '../server/supabase';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
    return (
        <AuthContextProvider>
          <RootLayoutNav />
        </AuthContextProvider>
    )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session } = useSession()

  useEffect(() => {
      const subscription = AppState.addEventListener("change", (state) => {
        if(state === 'active') {
           supabase.auth.startAutoRefresh()
        } else {
           supabase.auth.stopAutoRefresh()
        }
      })
  
      return () => subscription.remove();
  } , []
)


  return (
    
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthContextProvider>
      <Stack>
       {
        session ? (<Stack.Screen name="(tabs)" options={{ headerShown: false }} />) : (<Stack.Screen name="(auth)" options={{ headerShown: false }}/>)
       }  
        {/* // <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>
      <StatusBar style="auto" />
      </AuthContextProvider>
    </ThemeProvider>
  );
}
