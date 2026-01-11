import { AuthContextProvider } from "../hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./../global.css";
import { RootLayoutNav } from "../components/navigation/RootLayoutNav";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";

  SplashScreen.preventAutoHideAsync().catch(() => {});
    const queryClient = new QueryClient();


export default function RootLayout() {

  const [loaded, error] = useFonts({
    Rosemary: require("../../assets/fonts/Rosemary.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RootLayoutNav />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
