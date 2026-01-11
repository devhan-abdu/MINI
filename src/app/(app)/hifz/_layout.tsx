import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View ,Text} from "react-native";

const ACTIVE_COLOR = "#0b6623";
const INACTIVE_COLOR = "#666";

export default function HifzLayout() {
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
          title: "Hifz",
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
        name="log"
        options={{
            headerTitle: () => (
                      <View className="ml-1">
                        <Text className="text-gray-400 font-bold uppercase tracking-[2px] text-[9px]">
                          Hifz
                        </Text>
                        <Text className="text-xl font-black text-gray-900 leading-tight">
                          Log Progress
                        </Text>
                      </View>
                    ),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
