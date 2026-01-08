import { ReactNode } from "react";
import { ScrollView, View, Pressable, Keyboard } from "react-native";

export function ScreenContent({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingVertical: 16 }}
    >
      <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
    </ScrollView>
  );
}

export function ScreenFooter({ children }: { children: ReactNode }) {
  return (
    <View className="p-4 border-t border-gray-200 bg-white">{children}</View>
  );
}
