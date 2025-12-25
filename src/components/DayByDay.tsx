import { Ionicons } from "@expo/vector-icons"
import { View,Text } from "react-native"
import { IWeeklyPlan } from "../types";

type DayStatusData = IWeeklyPlan['weekly_plan_days'][0]


/// is this effective to send planData for each date 
export function DayByDay({ dayData, dayName }: { dayData?: DayStatusData; dayName: string }) {
  
    if (!dayData) {
      return (
        <DayIcon
          day={dayName}
          icon="remove-circle-outline"
          color="#94a3b8"
          label="Rest"
        />
      );
    }

    const activity = dayData.daily_muraja_logs?.[0];

    if (!activity) {
        return (
          <DayIcon
            day={dayName}
            icon="ellipse-outline"
            color="#cbd5e1"
            label="Pending"
          />
        );
    }

    const statusConfig = {
      completed: {
        icon: "checkmark-done-circle-outline",
        color: "#22c55e",
        label: "Completed",
      },
      partial: { icon: "time-outline", color: "#eab308", label: "Partial" },
      missed: {
        icon: "close-circle-outline",
        color: "#ef4444",
        label: "Missed",
      },
    };

    const config =
      statusConfig[activity.status as keyof typeof statusConfig] ||
      statusConfig.missed;

    return (
      <DayIcon
        day={dayName}
        icon={config.icon as any}
        color={config.color}
        label={config.label}
      />
    );
  }



 const DayIcon = ({ day, icon, color, label }: { day: string, icon: string, color: string, label: string }) => (
        
        <View className="items-center gap-1">
          <Text className="text-xs font-medium text-gray-500">{day}</Text>
          <View className="bg-white rounded-full p-1 shadow-sm border border-gray-50">
            <Ionicons name={icon as any} size={ 28} color={color}/>
          </View>
        </View>
      )