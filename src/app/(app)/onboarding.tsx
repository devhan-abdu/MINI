import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/src/components/ui/Button";
import Screen from "@/src/components/screen/Screen";
import { ScreenFooter } from "@/src/components/screen/ScreenContent";

export default function OnboardingBridge() {
  const [selected, setSelected] = useState<"hifz" | "muraja" | null>(null);

    return (
      <Screen>
        <View className="flex-1 pt-24 pb-12 justify-between">
          <View>
            <View className="w-12 h-1.5 bg-primary rounded-full mb-6" />
            <Text className="text-primary text-5xl font-bold font-rosemary leading-[52px] tracking-tighter">
              The Journey{"\n"}Starts Here.
            </Text>
            <Text className="text-slate-500 text-lg mt-4 leading-7">
              Choose your focus to personalize your experience. We’ll help you
              stay consistent.
            </Text>
          </View>

          <View className="gap-y-6">
            <Pressable
              onPress={() => setSelected("hifz")}
              className={`p-6 rounded-xl transition-all border-2 ${
                selected === "hifz" ?
                  "border-primary bg-primary/5"
                : "border-slate-200 bg-transparent"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text
                    className={`text-xl font-black ${selected === "hifz" ? "text-primary" : "text-slate-900"}`}
                  >
                    New Memorization
                  </Text>
                  <Text className="text-slate-500 text-sm mt-1">
                    Start a plan to memorize new Surahs page by page.
                  </Text>
                </View>
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    selected === "hifz" ? "bg-primary" : "bg-slate-100"
                  }`}
                >
                  <Ionicons
                    name="add"
                    size={22}
                    color={selected === "hifz" ? "white" : "#0f172a"}
                  />
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setSelected("muraja")}
              className={`p-6 rounded-xl transition-all border-2 ${
                selected === "muraja" ?
                  "border-primary bg-primary/5"
                : "border-slate-200 bg-transparent"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text
                    className={`text-xl font-black ${selected === "muraja" ? "text-primary" : "text-slate-900"}`}
                  >
                    Smart Revision
                  </Text>
                  <Text className="text-slate-500 text-sm mt-1">
                    Keep your Hifz strong with a structured revision cycle.
                  </Text>
                </View>
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    selected === "muraja" ? "bg-primary" : "bg-slate-100"
                  }`}
                >
                  <Ionicons
                    name="refresh"
                    size={22}
                    color={selected === "muraja" ? "white" : "#0f172a"}
                  />
                </View>
              </View>
            </Pressable>
          </View>

          <ScreenFooter>
            <Button
              disabled={!selected}
              onPress={() => {
                if (selected === "hifz") router.push("/(app)/create-hifz-plan");
                else router.push("/(app)/create-muraja-plan");
              }}
              style={{ opacity: selected ? 1 : 0.5 }}
              className="bg-primary h-18 mb-6 rounded-[28px] items-center justify-center shadow-2xl shadow-primary/40"
            >
              <Text className="text-white font-black text-lg uppercase tracking-widest">
                Continue
              </Text>
            </Button>
          </ScreenFooter>
        </View>
      </Screen>
    );
}
