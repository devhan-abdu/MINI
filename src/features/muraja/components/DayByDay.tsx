import {  IWeeklyMurajaDay } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { DAY_MAP } from "../utils/quranMapping";

const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DayByDay({ days }: { days: IWeeklyMurajaDay[] }) {
  const fullWeek = SHORT_DAYS.map((short) => {
    const dbDay = days.find((day) => DAY_MAP[day.day_of_week] === short);
    const log = dbDay?.daily_muraja_logs?.[0];
    const status = log?.status || (dbDay ? "missed" : "rest");

    return {
      dayName: short,
      status: status,
      isPlanned: !!dbDay,
    };
  });

  return (
    <View className="flex-row justify-between bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm shadow-black/5">
      {fullWeek.map((item) => {
        const isFull = item.status === "completed";
        const isPartial = item.status === "partial";
        const isMissed = item.status === "missed";

        return (
          <View key={item.dayName} className="items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center mb-2 border
                ${isFull ? "bg-primary border-primary" : ""} 
                ${isPartial ? "bg-amber-50 border-amber-200" : ""} 
                ${isMissed ? "bg-red-50 border-red-100" : ""}
                ${
                  !isFull && !isPartial && !isMissed
                    ? "bg-gray-50 border-transparent"
                    : ""
                }
              `}
            >
              {isFull ? (
                <Ionicons name="checkmark-sharp" size={16} color="white" />
              ) : isPartial ? (
                <Ionicons name="remove-sharp" size={16} color="#d97706" />
              ) : isMissed ? (
                <Ionicons name="close-outline" size={16} color="#ef4444" />
              ) : (
                <Text
                  className={`text-[10px] font-black ${
                    item.isPlanned ? "text-primary" : "text-gray-300"
                  }`}
                >
                  {item.dayName[0]}
                </Text>
              )}
            </View>

            <Text
              className={`text-[9px] font-black uppercase tracking-tighter ${
                item.isPlanned ? "text-primary" : "text-gray-400"
              }`}
            >
              {item.dayName}
            </Text>
          </View>
        );
      })}
    </View>
  );
}