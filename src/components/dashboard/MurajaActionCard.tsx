import { useMurajaOperation } from "@/src/features/muraja/hooks/useMurajaOperation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View, Text, ActivityIndicator, Alert } from "react-native";
import { StatusButton } from "./StatusButton";

export const MurajaActionCard = ({ todayPlan }: { todayPlan: any }) => {
  const { updateLog, isUpdating } = useMurajaOperation();
  const router = useRouter();

  const handleStatusChange = async (status: "completed" | "missed") => {
    try {
         
      const pages = status === "completed" ? todayPlan?.pages_per_day : 0;
       const todayStr = new Date().toISOString().slice(0, 10);
       const isPastDay = todayPlan.date < todayStr;

          await updateLog({
            dayId: todayPlan.id,
            status,
            date: todayPlan.date || todayStr,
            completed_pages: pages ,
        
            is_catch_up: isPastDay,
          });
    
       
        } catch (err) {
          Alert.alert("Error", "Failed to save log");
        }
  };

  return (
    <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm shadow-slate-200">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1">
                
              <Text className="text-slate-900 font-black text-xl tracking-tight">
            {todayPlan.startSurah}
            {todayPlan.startSurah !== todayPlan.endSurah &&
              ` – ${todayPlan.endSurah}`}
          </Text>
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[1.5px] mt-1">
            Muraja: page {todayPlan.planned_start_page}–{todayPlan.planned_end_page}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push(`/muraja/weekly-plane/${todayPlan.id}`)}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-primary/50 bg-primary"
        >
          <Ionicons name="create-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        <StatusButton
          label="Done"
          icon="checkmark-circle"
          activeColor="bg-primary"
          isActive={todayPlan.status === "completed"}
          onPress={() => handleStatusChange("completed")}
          loading={isUpdating}
        />
        <StatusButton
          label="Skip"
          icon="close-circle"
          activeColor="bg-red-500"
          isActive={todayPlan.status === "missed"}
          onPress={() => handleStatusChange("missed")}
          loading={isUpdating}
        />
      </View>
    </View>
  );
};


