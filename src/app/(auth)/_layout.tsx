import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 400,
      }}
    >
      <Stack.Screen name="intro" />
      <Stack.Screen
        name="login"
        options={{
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}