import { useSession } from "@/src/hooks/useSession";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function RootLayoutNav() {
  const { session, loading } = useSession();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.replace("/login");
    } else {
      router.replace("/(app)");
    }
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
