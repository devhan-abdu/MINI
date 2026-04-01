import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { RootLayoutNav } from "../components/navigation/RootLayoutNav";
import { AuthContextProvider } from "../hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Amiri: require("../../assets/fonts/AmiriQuran.ttf"),
    Rosemary: require("../../assets/fonts/Rosemary.ttf"),
    Uthman: require("../../assets/fonts/uthman.ttf"),
  });
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          }
        >
          <SQLiteProvider
            databaseName="quran2.db"
            assetSource={{ assetId: require("../../assets/db/quran3.sqlite") }}
          >
            <RootLayoutNav />
          </SQLiteProvider>
        </Suspense>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}
