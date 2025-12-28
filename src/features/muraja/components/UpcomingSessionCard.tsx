import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { TodayPlanType } from "../../../types";

export default function UpcomingSessionCard({
  upcomingSessions,
}: {
  upcomingSessions: TodayPlanType[];
}) {
  const router = useRouter();

  return (
    <View className="flex-col gap-3">
      {upcomingSessions.map((upcoming) => (
        <Pressable
          key={upcoming.id}
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
              <Text className="font-bold text-gray-800 text-lg">
                {upcoming.day_of_week}
              </Text>
              <View className="flex-col items-start gap-2 mt-1">
                <Text className="text-gray-900 mr-2">
                  {upcoming.startSurah === upcoming.endSurah
                    ? upcoming.startSurah
                    : `${upcoming.startSurah} – ${upcoming.endSurah}`}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={18} color="#4B5563" />
                  <Text className="text-gray-600 text-sm">
                    {upcoming?.estimated_time_min}
                  </Text>
                </View>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </Pressable>
      ))}
    </View>
  );
}
