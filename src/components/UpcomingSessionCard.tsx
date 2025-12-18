import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { getSurahByPage } from "../lib/utils";
import { useLoadSurahData } from "../hooks/useFetchQuran";

interface UpcomingSessionCardProps {
  day: string;
  startPage: number;
  endPage: number;
  duration: string;
}

export default function UpcomingSessionCard({
  day,
  startPage,
  endPage,
  duration,
}: UpcomingSessionCardProps) {
  const router = useRouter();
  const { items: surah } = useLoadSurahData();
  const startSurah = getSurahByPage(startPage, surah);
  const endSurah = getSurahByPage(endPage, surah);

  return (
    <Pressable
      onPress={() => router.push("/muraja/weekly-plane/")}
      className="bg-white rounded-xl p-4 border border-gray-300 bg-white shadow-sm"
    >
      <View className="flex-row justify-between items-center gap-2">
        <Ionicons
          name="calendar-outline"
          size={20}
          className="p-3 rounded-full bg-green-100"
          color={"#0b6623"}
        />

        <View className="flex-1">
          <Text className="font-bold text-gray-800 text-lg">{day}</Text>
          <View className="flex-col items-start gap-2 mt-1">
            <Text className="text-gray-900 mr-2">
              {startSurah === endSurah
                ? startSurah
                : `${startSurah} – ${endSurah}`}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={18} color="#4B5563" />
              <Text className="text-gray-600 text-sm">{duration}</Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </Pressable>
  );
}
