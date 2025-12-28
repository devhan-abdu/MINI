import { ReactNode } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IScreenWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function ScreenWrapper({ children, className = "" }: IScreenWrapperProps) {
  return (
    <SafeAreaView className={`flex-1 bg-white ${className}`}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={Keyboard.dismiss} className="flex-1">
            {children}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
