import { ReactNode } from "react";
import {
  ScrollView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

export function ScreenContent({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 16,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 ">{children}</View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

export function ScreenFooter({ children }: { children: ReactNode }) {
  return (
    <View className="p-4 border-t border-gray-200 bg-white">{children}</View>
  );
}
