import { Button } from "@/src/components/ui/Button";
import { StatusChip } from "@/src/components/ui/StatusChip";
import { TodayPlanType } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";

interface TodayMurajaCardProps {
  todayPlan: TodayPlanType;
  onStatusUpdate: (status: "completed" | "partial" | "missed") => void;
  isUpdating: boolean;
}

export const TodayMurajaCard = ({
  todayPlan,
  onStatusUpdate,
  isUpdating,
}: TodayMurajaCardProps) => {
  const router = useRouter();

  const isDisabled = isUpdating || todayPlan.status !== "pending";

  return (
    <View className="bg-white rounded-xl  border border-gray-300 shadow-sm">
      <View className="p-6">
        <View className="flex-row justify-between items-center mb-6 ">
          <View>
            <Text className="text-xl font-medium text-gray-900">
              {todayPlan.startSurah === todayPlan.endSurah
                ? todayPlan.startSurah
                : `${todayPlan.startSurah} – ${todayPlan.endSurah}`}
            </Text>
            <Text className="text-sm uppercase tracking-wide text-gray-700 mt-1">
              Pages {todayPlan.planned_start_page}–{todayPlan.planned_end_page}
            </Text>
          </View>
          <Ionicons name="book-outline" size={24} color="#276359" />
        </View>

        <View className="border-t border-gray-300 pt-6 ">
          {status !== "pending" ? (
            <View className="gap-3">
              <StatusChip status={todayPlan.status} />
              <Button
                className="py-3 mt-2"
                onPress={() =>
                  router.push(`/muraja/weekly-plane/${todayPlan.id}`)
                }
              >
                Log Today's Muraja'a
              </Button>
            </View>
          ) : (
            <View className="flex-row justify-between gap-3">
              <ActionButton
                label="Done"
                color="bg-green-600"
                onPress={() => onStatusUpdate("completed")}
                loading={isUpdating}
                disabled={isDisabled}
              />
              <ActionButton
                label="Partial"
                color="bg-yellow-500"
                onPress={() => onStatusUpdate("partial")}
                loading={isUpdating}
                disabled={isDisabled}
              />
              <ActionButton
                label="Missed"
                color="bg-red-500"
                onPress={() => onStatusUpdate("missed")}
                loading={isUpdating}
                disabled={isDisabled}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const ActionButton = ({ label, color, onPress, loading, disabled }: any) => {
  return (
    <Pressable
      className={`flex-1 ${color}  px-3 py-2 rounded-xl active:opacity-70 ${
        disabled ? "opacity-50" : ""
      }`}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-center font-bold text-white">{label}</Text>
      )}
    </Pressable>
  );
};
