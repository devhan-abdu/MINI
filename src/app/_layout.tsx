import { AuthContextProvider } from "../hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./../global.css";
import { RootLayoutNav } from "../components/navigation/RootLayoutNav";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const queryClient = new QueryClient();

  SplashScreen.preventAutoHideAsync();
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
