import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

export default function Screen({
  children,
  className = "",
}: ScreenProps) {
  return (
    <View className={`flex-1 bg-white px-4 ${className}`}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}
