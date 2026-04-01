import { IWeeklyMuraja } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/src/components/common/ui/Text";
import { View } from "react-native";

export const WeeklyOverviewCard = ({
  weeklyPlan,
  dayCount,
  dateRange,
}: {
  weeklyPlan: IWeeklyMuraja;
  dayCount: number;
  dateRange: string;
}) => {
  return (
    <View className="bg-primary rounded-[32px] p-6 mb-6 shadow-xl shadow-primary/20 overflow-hidden border border-white/10">
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-white/50  uppercase tracking-[2px] text-[9px] mb-1.5">
            Active Cycle
          </Text>
          <View className="bg-white/15 px-3 py-1 rounded-full self-start border border-white/5">
            <Text className="text-white text-[10px]  ">{dateRange}</Text>
          </View>
        </View>
        <View className="h-10 w-10 bg-white/10 rounded-2xl items-center justify-center">
          <Ionicons name="stats-chart" size={18} color="white" />
        </View>
      </View>

      <View className="flex-row items-center mb-8">
        <View className="flex-1">
          <Text className="text-white/50  uppercase tracking-widest text-[9px] mb-1">
            Total Pages
          </Text>
          <Text className="text-white text-4xl  tracking-tighter">
            {weeklyPlan.planned_pages * dayCount}
          </Text>
        </View>

        <View className="h-10 w-[1px] bg-white/10 mx-4" />

        <View className="flex-1">
          <Text className="text-white/50  uppercase tracking-widest text-[9px] mb-1">
            Juz Focus
          </Text>
          <Text className="text-white text-2xl  tracking-tight">
            {weeklyPlan.start_juz}—{weeklyPlan.end_juz}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center border-t border-white/10 pt-5 mt-2">
        <View className="flex-1 items-center border-r border-white/10">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons
              name="calendar-outline"
              size={12}
              color="rgba(255,255,255,0.6)"
            />
            <Text className="text-white  text-sm">{dayCount}</Text>
          </View>
          <Text className="text-white/40 text-[8px]  uppercase tracking-[1.5px]">
            Days
          </Text>
        </View>

        <View className="flex-1 items-center border-r border-white/10">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons
              name="time-outline"
              size={12}
              color="rgba(255,255,255,0.6)"
            />
            <Text className="text-white  text-sm">
              {weeklyPlan.estimated_time_min}m
            </Text>
          </View>
          <Text className="text-white/40 text-[8px]  uppercase tracking-[1.5px]">
            Daily
          </Text>
        </View>

        <View className="flex-1 items-center">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons
              name="book-outline"
              size={12}
              color="rgba(255,255,255,0.6)"
            />
            <Text className="text-white  text-sm">
              {weeklyPlan.planned_pages}
            </Text>
          </View>
          <Text className="text-white/40 text-[8px]  uppercase tracking-[1.5px]">
            Pages
          </Text>
        </View>
      </View>
    </View>
  );
};
