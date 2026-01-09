import { Button } from "@/src/components/ui/Button";
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

        <View className="border-t border-slate-100 pt-6 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
              Session Status
            </Text>

            <Pressable
              onPress={() =>
                router.push(`/muraja/weekly-plane/${todayPlan.id}`)
              }
              className="flex-row items-center bg-primary/20 px-3 py-1.5 rounded-full active:bg-slate-100"
            >
              <Text className="text-primary font-bold text-[11px] mr-1.5">
                Add Log
              </Text>
              <Ionicons name="chevron-forward" size={12} color="#276359" />
            </Pressable>
          </View>

          <View className="flex-row justify-between gap-2">
            <ActionButton
              label="Done"
              icon="checkmark-circle"
              colorClass="bg-primary border-emerald-600"
              onPress={() => onStatusUpdate("completed")}
              isActive={todayPlan.status === "completed"}
              loading={isUpdating}
            />
            <ActionButton
              label="Partial"
              icon="pie-chart"
              colorClass="bg-primary border-primary"
              onPress={() => onStatusUpdate("partial")}
              isActive={todayPlan.status === "partial"}
              loading={isUpdating}
            />
            <ActionButton
              label="Missed"
              icon="close-circle"
              colorClass="bg-red-500 border-red-500"
              onPress={() => onStatusUpdate("missed")}
              isActive={todayPlan.status === "missed"}
              loading={isUpdating}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const ActionButton = ({
  label,
  icon,
  colorClass,
  onPress,
  loading,
  disabled,
  isActive,
}: any) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 flex-row items-center justify-center gap-2 px-3 py-3 rounded-2xl border 
        ${isActive ? colorClass : "bg-white border-slate-100"} 
        ${disabled ? "opacity-40" : "active:scale-[0.96] shadow-sm"}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#64748b" />
      ) : (
        <>
          <Ionicons
            name={icon}
            size={16}
            color={isActive ? "white" : "#64748b"}
          />
          <Text
            className={`text-[11px] font-black uppercase tracking-wider 
            ${isActive ? "text-white" : "text-slate-500"}`}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};
