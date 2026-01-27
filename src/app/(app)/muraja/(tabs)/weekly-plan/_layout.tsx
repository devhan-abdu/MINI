import { Header } from "@/src/components/navigation/Header";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function WeeklyLayout() {
  return (
    <View className="flex-1 bg-white">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen name="[id]" options={{ animation: "slide_from_right" }} />
      </Stack>
    </View>
  );
}
