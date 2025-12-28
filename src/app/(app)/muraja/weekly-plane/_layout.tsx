import { Stack } from "expo-router";

export default function WeeklyPlaneLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Weekly Plane",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
