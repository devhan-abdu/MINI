import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { StatusTab } from "@/src/features/hifz/components/StatusTab";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { useAddLog } from "@/src/features/hifz/hook/useAddLog";
import { useSession } from "@/src/hooks/useSession";
import { Button } from "@/src/components/ui/Button";
import { getNextTask } from "@/src/features/hifz/utils";
import { IHifzLog } from "@/src/features/hifz/types";
import Screen from "@/src/components/screen/Screen";
import { ScreenContent, ScreenFooter } from "@/src/components/screen/ScreenContent";

export default function LogProgress() {
  const router = useRouter();
  const { user } = useSession();
  const { hifz: plan, isLoading: planLoading } = useGetHifzPlan();
  const { items: surahData, loading: quranLoading } = useLoadSurahData();
  const { addLog, isCreating } = useAddLog();

  const [pages, setPages] = useState(plan?.pages_per_day || 1);
  const [status, setStatus] = useState<"completed" | "partial" | "missed">(
    "completed"
  );
  const [notes, setNotes] = useState("");
 
  

 const logContext = useMemo(() => {
   if (!plan || !surahData) return null;

   const logs = plan.hifz_daily_logs || [];
   const lastLog = logs[logs.length - 1]
   const referencePage = lastLog ? lastLog.actual_end_page  : plan.start_page
   
  
   const nextTask = getNextTask(
     plan.direction,
     referencePage,
     plan.pages_per_day,
     surahData,
     !lastLog
   );

   if (!nextTask) return null;

   return {
     ...nextTask,
     surah: nextTask.displaySurah, 
     isBackward: plan.direction === "backward",
     target: plan.pages_per_day,
   };
 }, [plan, surahData]);

 const handleSave = async () => {
   if (!plan || !logContext || isCreating || !plan.id) return;

   try {
     const today = new Date();
     const logDay = (today.getDay() + 6) % 7;

     
     const actualTask = getNextTask(
       plan.direction as "forward" | "backward",
       plan.hifz_daily_logs?.length
         ? plan.hifz_daily_logs[plan.hifz_daily_logs.length - 1].actual_end_page
         : plan.start_page,
       pages, 
       surahData,
       plan.hifz_daily_logs?.length === 0
     );

     const payload: IHifzLog = {
       hifz_plan_id: plan.id,
       actual_pages_completed: pages,
       actual_start_page: logContext.startPage,
       actual_end_page: actualTask?.endPage || logContext.startPage,
       status,
       date: today.toISOString().slice(0, 10),
       log_day: logDay,
       notes: notes.trim(),
     };

     await addLog({ todayLog: payload, userId: user?.id });
     router.back();
   } catch (err) {
     Alert.alert("Error", "Could not save your progress.");
   }
 };
  if (planLoading || quranLoading) return <View className="flex-1 bg-white" />;
  if (!plan || !logContext) return null;

  return (
    <Screen>
      <ScreenContent>
        <View className="bg-primary p-6 rounded-[32px] mb-8 shadow-xl shadow-green-900/20">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-white/60 font-bold text-[10px] uppercase tracking-widest">
              Today's Task
            </Text>
            <View className="bg-white/20 px-2 py-1 rounded-3xl">
              <Text className="text-white text-[9px] font-black uppercase">
                {logContext.isBackward ? "Backward" : "Forward"}
              </Text>
            </View>
          </View>

          <Text className="text-white text-3xl font-black mb-6">
            {logContext.surah || "Surah Al-Baqarah"}
          </Text>

          <View className="flex-row items-center border-t border-white/10 pt-5">
            <View className="pr-6 mr-6 border-r border-white/10">
              <Text className="text-white text-3xl font-black">
                {logContext.target}
              </Text>
              <Text className="text-white/60 text-[10px] font-bold uppercase">
                Target
              </Text>
            </View>
            <View>
              <Text className="text-white text-lg font-bold">
                Pages {logContext.startPage}{" "}
                {logContext.startPage !== logContext.endPage
                  ? `— ${logContext.endPage}`
                  : ""}
              </Text>
              <Text className="text-white/60 text-[10px] font-bold uppercase">
                Juz {logContext.juz}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xl font-black text-gray-900 mb-4">
          How did it go?
        </Text>
        <View className="flex-row justify-between mb-8">
          <StatusTab
            label="Completed"
            icon="checkmark-circle"
            active={status === "completed"}
            onPress={() => {
              setStatus("completed");
              setPages(logContext.target);
            }}
          />
          <StatusTab
            label="Partial"
            icon="contrast"
            active={status === "partial"}
            onPress={() => setStatus("partial")}
          />
          <StatusTab
            label="Missed"
            icon="close-circle"
            active={status === "missed"}
            onPress={() => {
              setStatus("missed");
              setPages(0);
            }}
          />
        </View>

        <View className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 flex-row items-center justify-between mb-8">
          <View>
            <Text className="font-black text-gray-900 text-lg">
              Pages Memorized
            </Text>
            <Text className="text-gray-400 text-xs font-medium">
              Actual progress today
            </Text>
          </View>
          <View className="flex-row items-center bg-white rounded-2xl p-1.5 border border-gray-200">
            <Pressable
              onPress={() => setPages((prev) => Math.max(0, prev - 1))}
              className="w-10 h-10 items-center justify-center active:bg-gray-50 rounded-xl"
            >
              <Ionicons name="remove" size={20} color="#276359" />
            </Pressable>
            <Text className="text-2xl font-black text-gray-900 px-4">
              {pages}
            </Text>
            <Pressable
              onPress={() => setPages((prev) => prev + 1)}
              className="w-10 h-10 items-center justify-center active:bg-gray-50 rounded-xl"
            >
              <Ionicons name="add" size={20} color="#276359" />
            </Pressable>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-gray-400 font-bold uppercase text-[10px] mb-2 ml-1 tracking-widest">
            Reflection or Notes
          </Text>
          <TextInput
            multiline
            placeholder="Difficulties with specific ayahs?"
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            className="bg-gray-50 p-5 rounded-[28px] border border-gray-100 h-32 text-gray-900 font-medium"
            textAlignVertical="top"
          />
        </View>
      </ScreenContent>
      <ScreenFooter>
        <Button
          onPress={handleSave}
          disabled={isCreating}
          className="bg-primary h-14  shadow-lg shadow-primary/30"
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-white font-black text-lg mr-2">
              Save Progress
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </Button>
      </ScreenFooter>
    </Screen>
  );
}
