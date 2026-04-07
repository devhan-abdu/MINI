import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/src/components/common/ui/Text";
import { View } from "react-native";
import { IWeeklyMUrajaStatus } from "../types";

export function DayByDay({ progress }: { progress: IWeeklyMUrajaStatus[] | null}) {

  if (!progress) return;

  return (
    <View className="flex-row justify-between bg-white p-5 rounded-[32px] border border-gray-100">
      {progress.map((day) => {

        const isCompleted = day.status === "completed";
        const isMissed = day.status === "missed";
        const isRest = day.status === "rest";
        const isPending = day.status === "pending";

        return (
          <View key={day.dayName} className="items-center">
            <View
              className={`w-9 h-9 rounded-full items-center justify-center mb-2 
                ${isCompleted ? "bg-primary" : ""}
                ${isMissed ? "bg-red-50 border border-red-100" : ""}
                ${isRest ? "bg-gray-50  border border-gray-200" : "bg-gray-100"}
                ${isPending ? "border-2 border-primary border-dashed bg-white" : ""}
              `}
            >
              {isCompleted ?
                <Ionicons name="checkmark" size={16} color="white" />
              : isMissed ?
                <Ionicons name="close" size={14} color="#f87171" />
              : isRest ?
                <Ionicons name="cafe-outline" size={14} color="#9ca3af" />
              : <Text
                  className={`text-[10px] ${day.isToday ? "text-primary font-bold" : "text-gray-400"}`}
                >
                  {day.dayName[0]}
                </Text>
              }
            </View>

            <Text
              className={`text-[10px] ${day.isToday ? "text-primary font-bold" : "text-gray-400"}`}
            >
              {day.dayName}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
