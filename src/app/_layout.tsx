import { AuthContextProvider } from "../hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./../global.css";
import { RootLayoutNav } from "../components/navigation/RootLayoutNav";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useEffect } from "react";
import { useFonts } from "expo-font";
import { SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator, View } from "react-native";

  SplashScreen.preventAutoHideAsync().catch(() => {});
    const queryClient = new QueryClient();

    


export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    UthmanicHafs: require("../../assets/fonts/KFGQPCUthmanicScriptHAFS.otf"),
    Thuluth: require("../../assets/fonts/Thuluth.ttf"),
    UthmanTaha: require("../../assets/fonts/UthmanTaha.ttf"),
    meQuran: require("../../assets/fonts/meQuran.ttf"),
    hafs: require("../../assets/fonts/hafs.ttf"),
  });


  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Suspense fallback={<LoadingView />}>
          <SQLiteProvider
            databaseName="qpc-v2-15-lines.db"
            assetSource={{
              assetId: require("../../assets/qpc-v2-15-lines.db"),
            }}
            useSuspense
          >
            <RootLayoutNav />
          </SQLiteProvider>
        </Suspense>
      </AuthContextProvider>
    </QueryClientProvider>
  );

  
}


function LoadingView() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#276359" />
    </View>
  );
}


