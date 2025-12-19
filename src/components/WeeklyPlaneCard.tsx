import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Button } from "./ui/Button";
import StatusBadge from "./ui/StatusBadge";
import { useRouter } from "expo-router";

type StatusType = "completed" | "pending" | "missed" | "partial";

interface WeeklyPlanCardProps {
  day: string;
  date: string;
  status: StatusType;
  startSurah: string;
  endSurah: string;
  pages: number;
  minutes: number;
  logId: number | null;
  startPage: number;
  endPage: number;
  planId: number | null;
}

export default function WeeklyPlanCard({
  day,
  date,
  status,
  startSurah,
  endSurah,
  logId,
  planId,
  pages,
  minutes,
  startPage,
  endPage,
}: WeeklyPlanCardProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  if (!planId) return null;

  const handlePress = () => {
    router.push({
      pathname: "/muraja/weekly-plane/[id]",
      params: {
        id: planId,
        status: status,
        logId: logId,
      },
    });
  };
  return (
    <View
      className="border border-gray-300 bg-white shadow-sm rounded-xl flex-col gap-4 px-4 py-5 mb-4"
      key={planId}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View>
          <Text className="text-xl font-bold text-gray-900">{day}</Text>
          <Text className="text-sm text-gray-900 mt-1">
            {startSurah === endSurah
              ? startSurah
              : `${startSurah} – ${endSurah}`}
          </Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <View className="flex-row items-center justify-between px-2 border-t border-gray-200 pt-4">
        <View className="items-center flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="book-outline" size={16} color="#4b5563" />
            <Text className="text-sm text-gray-700 font-medium">
              page {startPage} - {endPage}
            </Text>
          </View>
          <Text className="text-xs text-gray-500">Page</Text>
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
      </View>

      {date <= today && (
        <Button
          className="py-3 mt-4"
          onPress={handlePress}
          variant={today === date ? "primary" : "outline"}
        >
          {today === date
            ? "Log Today's Muraja'a"
            : status === "completed"
            ? "Veiw Log"
            : "Log Past Day"}
        </Button>
      )}
    </View>
  );
}
