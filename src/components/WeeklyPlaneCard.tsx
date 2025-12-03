import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Button } from "./ui/Button";
import StatusBadge from "./ui/StatusBadge";
type StatusType = "Completed" | "Pending" | "Missed" | "Partial";

interface WeeklyPlanCardProps {
  day: string;
  status: StatusType;
  juz: string;
  pages: number;
  minutes: number;
  onPress: () => void;
}

export default function WeeklyPlanCard({
  day,
  status,
  juz,
  pages,
  minutes,
  onPress
}: WeeklyPlanCardProps) {
  return (
    <View className="border border-gray-300 bg-white shadow-sm rounded-xl flex-col gap-4 px-4 py-5 mb-4">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {day}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Daily reading goal
          </Text>
        </View>
        <StatusBadge status={status}  />
      </View>
      
      <View className="flex-row items-center justify-between px-2">
        <View className="items-center flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="book-outline" size={16} color="#4b5563" />
            <Text className="text-sm text-gray-700 font-medium">
              {juz}
            </Text>
          </View>
          <Text className="text-xs text-gray-500">Juz</Text>
        </View>
        
        <View className="h-6 w-px bg-gray-300" />
        
        <View className="items-center flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="layers-outline" size={16} color="#4b5563" />
            <Text className="text-sm text-gray-700 font-medium">
              {pages} pages
            </Text>
          </View>
          <Text className="text-xs text-gray-500">Pages</Text>
        </View>
        
        <View className="h-6 w-px bg-gray-300" />
        
        <View className="items-center flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="time-outline" size={16} color="#4b5563" />
            <Text className="text-sm text-gray-700 font-medium">
              {minutes} min
            </Text>
          </View>
          <Text className="text-xs text-gray-500">Time</Text>
        </View>
      </View>

      <Button 
        className="py-3 mt-4"
        onPress={onPress}
        variant={status === "Completed" ? "outline" : "primary"}
      >
        {status === "Completed" ? "View Log" : "Log Today's Muraja'a"}
      </Button>
    </View>
  );
}