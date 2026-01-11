import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const ACTIVE_COLOR = "#0b6623";
const INACTIVE_COLOR = "#666";

export default function MurajaLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#111",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 5,
        },
        headerShadowVisible: false,
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Muraja",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="weekly-plane"
        options={{
          title: "plan",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="[review]"
        options={{
          title: "Review",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
