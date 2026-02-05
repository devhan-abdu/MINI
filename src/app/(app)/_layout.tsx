import { AppLoadingScreen } from "@/src/components/common/AppLoadingScreen";
import { useSession } from "@/src/hooks/useSession";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = "#276359";
const INACTIVE_COLOR = "#94a3b8";

export default function AppLayout() {
  const { session, loading } = useSession();
  const insets = useSafeAreaInsets();

  if (loading) {
    return <AppLoadingScreen />;
  }

  if (!session) {
    return <Redirect href="./(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="muraja"
        options={{
          title: "Muraja",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "sync" : "sync-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="quran"
        options={{
          title: "Quran",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="hifz"
        options={{
          title: "Hifz",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "ribbon" : "ribbon-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
