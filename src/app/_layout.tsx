import { AuthContextProvider } from "../hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./../global.css";
import { RootLayoutNav } from "../components/navigation/RootLayoutNav";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RootLayoutNav />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
