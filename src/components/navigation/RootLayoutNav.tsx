import { useSession } from "@/src/hooks/useSession";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import {
  ActivityIndicator,
  useColorScheme,
  View,
  Image,
  Text,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export function RootLayoutNav() {
  const { session, loading } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  console.log(session,"session")

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-[#0f172a]">
        <View className="items-center">
          <Image
            source={require("@/assets/images/minilogo.png")}
            style={{ width: 120, height: 120, marginBottom: 12 }}
            resizeMode="contain"
          />

          <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Mini
          </Text>

          <View className="mt-1 mb-10">
            <Text className="text-[10px] font-bold text-primary uppercase tracking-[4px]">
              Hifz & Muraja
            </Text>
          </View>

          <ActivityIndicator size="small" color="#276359" />
        </View>
      </View>
    );
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
