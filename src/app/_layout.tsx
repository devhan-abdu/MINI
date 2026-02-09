import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { RootLayoutNav } from "../components/navigation/RootLayoutNav";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Amiri: require("../../assets/fonts/AmiriQuran.ttf"),
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
       <Suspense fallback={<LoadingView />}>
      <SQLiteProvider
        databaseName="quran.db"
        assetSource={{ assetId: require("../../assets/quran.db") }}
      >
      <RootLayoutNav/>
      </SQLiteProvider>
    </Suspense> 
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


