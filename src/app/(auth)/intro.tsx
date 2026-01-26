import { View, Text, StatusBar } from "react-native";
import { router } from "expo-router";
import { Button } from "@/src/components/ui/Button";

export default function IntroScreen() {
  return (
    <View className="flex-1 bg-primary px-8 pt-24 pb-16 justify-between">
      <StatusBar barStyle="light-content" />

      <View>
        <Text className="text-white/50 font-bold uppercase tracking-[3px] text-xs mb-2">
          Quran Companion
        </Text>
        <Text className="text-white text-6xl font-black font-rosemary leading-[60px] tracking-tighter">
          Master Your{"\n"}Hifz &{"\n"}Revision
        </Text>
      </View>

      <View className="gap-y-8">
        <View className="flex-row items-start">
          <View className="w-1 bg-white/30 h-full mr-4 rounded-full" />
          <View className="flex-1">
            <Text className="text-white font-black text-xl mb-1">
              Guided Hifz
            </Text>
            <Text className="text-white/60 leading-5">
              A structured, page-by-page tracker to help you memorize with
              consistency.
            </Text>
          </View>
        </View>

        <View className="flex-row items-start">
          <View className="w-1 bg-white/30 h-full mr-4 rounded-full" />
          <View className="flex-1">
            <Text className="text-white font-black text-xl mb-1">
              Smart Muraja
            </Text>
            <Text className="text-white/60 leading-5">
              Never forget a single Ayah with our automated revision scheduling
              system.
            </Text>
          </View>
        </View>
      </View>

      <View className="my-8">
        <Button
          onPress={() => router.push("/(auth)/login")}
          className="bg-white "
        >
          <Text className="text-primary font-black text-lg uppercase tracking-widest">
            Get Started
          </Text>
        </Button>
      </View>
    </View>
  );
}
