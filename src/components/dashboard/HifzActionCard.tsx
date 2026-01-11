import React from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAddLog } from "@/src/features/hifz/hook/useAddLog";
import { useRouter } from "expo-router";
import { getNextTask } from "@/src/features/hifz/utils/quran-logic";
import { IHifzLog, IHifzPlan } from "@/src/features/hifz/types";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { useSession } from "@/src/hooks/useSession";
import { StatusButton } from "./StatusButton";



export const HifzActionCard = ({
  hifz,
  nextTask,
}: {
  hifz: IHifzPlan;
  nextTask: any;
}) => {
  const { addLog, isCreating } = useAddLog();
  const { items: surahData } = useLoadSurahData()
  const {user} = useSession()
  const router = useRouter();

 

  if (!nextTask) return;

  const handleStatusChange = async (
    status: "completed"  | "missed"
  ) => {

    if (!hifz || !nextTask || isCreating || !hifz.id) return;

    const pages = status === "completed" ? hifz?.pages_per_day : 0;
    
       try {
         const today = new Date();
         const logDay = today.getDay();
    
         
         const actualTask = getNextTask(
           hifz.direction as "forward" | "backward",
           hifz.hifz_daily_logs?.length
             ? hifz.hifz_daily_logs[hifz.hifz_daily_logs.length - 1].actual_end_page
             : hifz.start_page,
           pages, 
           surahData,
           hifz.hifz_daily_logs?.length === 0
         );
    
         const payload: IHifzLog = {
           hifz_plan_id: hifz.id,
           actual_pages_completed: pages,
           actual_start_page: nextTask.startPage,
           actual_end_page: actualTask?.endPage || nextTask.startPage,
           status,
           date: today.toISOString().slice(0, 10),
           log_day: logDay,
         };
    
         await addLog({ todayLog: payload, userId: user?.id });
       } catch (err) {
         Alert.alert("Error", "Could not save your progress.");
       }
  };

  return (
    <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm shadow-slate-200">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1">
          <Text className="text-slate-900 font-black text-xl tracking-tight">
            {nextTask.startSurah === nextTask.endSurah
              ? nextTask.startSurah
              : `${nextTask.startSurah} – ${nextTask.endSurah}`}
          </Text>
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[1.5px] mt-1">
            Hifz: Pages {nextTask.startPage}–{nextTask.endPage}
          </Text>
        </View>

        <Pressable
            onPress={() => router.push("/(app)/hifz/log")} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-50 bg-primary"
        >
          <Ionicons name="create-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        <StatusButton
          label="Done"
          icon="checkmark-circle"
          activeColor="bg-primary"
          isActive={nextTask.status === "completed"}
          onPress={() => handleStatusChange("completed")}
          loading={isCreating}
        />

        <StatusButton
          label="Skip"
          icon="close-circle"
          activeColor="bg-red-600"
          isActive={nextTask.status === "missed"}
          onPress={() => handleStatusChange("missed")}
          loading={isCreating}
        />
      </View>
    </View>
  );
};


