import { IWeeklyMuraja } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export const WeeklyOverviewCard = ({
  weeklyPlan,
  dayCount,
}: {
  weeklyPlan: IWeeklyMuraja;
  dayCount: number;
}) => {
  return (
    <View className="bg-white rounded-2xl p-6 mb-6 shadow-xl border border-gray-200">
      <View className="mb-5">
        <Text className="text-gray-700 text-xs font-medium uppercase">
          Total Pages
        </Text>
        <Text className="text-3xl font-extrabold text-gray-900">
          {weeklyPlan.planned_pages * dayCount}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm">JUZ Range</Text>
        <Text className="text-2xl font-bold text-gray-800">
          {weeklyPlan.start_juz} - {weeklyPlan.end_juz}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm">Surah Range</Text>
        <Text className="text-lg font-semibold text-gray-700">
          {weeklyPlan.start_surah} - {weeklyPlan.end_surah}
        </Text>
      </View>

      <View className="flex-row justify-between gap-4 mt-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar-outline" size={18} color="#4B5563" />
          <Text className="text-gray-600 text-sm">{dayCount} days/week</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={18} color="#4B5563" />
          <Text className="text-gray-600 text-sm">
            {weeklyPlan.estimated_time_min} min/day
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="book-outline" size={18} color="#4B5563" />
          <Text className="text-gray-600 text-sm">
            {weeklyPlan.planned_pages} pages/day
          </Text>
        </View>
      </View>
    </View>
  );
};
