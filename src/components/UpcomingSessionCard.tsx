import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface UpcomingSessionCardProps {
  day: string;
  juz: string;
  duration: string;
}

export default function UpcomingSessionCard({ 
  day, 
  juz, 
  duration 
}: UpcomingSessionCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 border border-gray-300 bg-white shadow-sm">
      <View className="flex-row justify-between items-center gap-2">
          <Ionicons name="calendar-outline" size={20} className="p-3 rounded-full bg-green-100" color={"#0b6623"}/>
        <View className="flex-1">
          <Text className="font-bold text-gray-800 text-lg">{day}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-700 mr-2">{juz}</Text>
            <View className="h-1 w-1 bg-gray-400 rounded-full mr-2" />
            <Text className="text-gray-600">{duration}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </View>
  );
}