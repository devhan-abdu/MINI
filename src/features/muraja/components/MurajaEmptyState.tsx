import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Screen from "@/src/components/screen/Screen";
import { FeatureRow } from "@/src/components/FeatureRow";

export default function MurajaEmptyState() {
  const router = useRouter();

  return (
    <Screen>
      <View className="flex-1 px-6 justify-center bg-white">
        <View className="items-center mb-10">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6 border border-blue-100">
            <Ionicons name="repeat-outline" size={48} color="#276359" />
          </View>
          <Text className="text-3xl font-black text-gray-900 text-center px-4">
            Strengthen Your Quran
          </Text>
          <Text className="text-gray-500 text-center mt-3 text-base leading-6 px-6">
            "Keep refreshing the Quran, for it leaves the heart faster than a
            camel escapes its tie."
          </Text>
        </View>

        <View className="gap-y-6 mb-12">
          <FeatureRow
            icon="infinite-outline"
            title="Weekly Rotations"
            desc="Organize your revision into 7-day manageable sessions."
          />
          <FeatureRow
            icon="shield-checkmark-outline"
            title="Prevent Forgetfulness"
            desc="Regular review ensures your Hifz stays solid for life."
          />
          <FeatureRow
            icon="stats-chart-outline"
            title="Detailed Analytics"
            desc="Track which Juz or Surahs need more focus."
          />
        </View>

        <Pressable
          onPress={() => router.push("/(app)/muraja/create-plan")}
          className="bg-primary h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          <Text className="text-white font-black text-lg mr-2">
            Create Weekly Plan
          </Text>
          <Ionicons name="add-circle-outline" size={22} color="white" />
        </Pressable>

        <Text className="text-center text-gray-400 text-[10px] mt-6 uppercase tracking-[2px] font-bold">
          Establish Your Routine
        </Text>
      </View>
    </Screen>
  );
}

