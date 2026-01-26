import { Stack } from "expo-router";

export default function HifzLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
        headerTintColor: "#276359", 
        headerTitleStyle: {
          fontWeight: "900",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }} 
      />

      <Stack.Screen
        name="log"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
