import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { StatusTab } from "@/src/features/hifz/components/StatusTab";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { useAddLog } from "@/src/features/hifz/hook/useAddLog";
import { useSession } from "@/src/hooks/useSession";
import { Button } from "@/src/components/ui/Button";
import { IHifzLog } from "@/src/features/hifz/types";
import Screen from "@/src/components/screen/Screen";
import {
  ScreenContent,
  ScreenFooter,
} from "@/src/components/screen/ScreenContent";
import { getTodayTask } from "@/src/features/hifz/utils/quran-logic";
import { Alert } from "@/src/components/common/Alert";
import { LogProgressSkeleton } from "@/src/features/hifz/components/skeleton";
import { Switch } from "@/src/features/hifz/components/Switch";
import { hifzStatus } from "@/src/features/hifz/utils/plan-status";
import { getTargetPage } from "@/src/features/hifz/utils/getTargetPage";

export default function LogProgress() {
  const router = useRouter();
  const { user } = useSession();

  const { hifz: plan, isLoading: planLoading } = useGetHifzPlan();
  const { items: surahData, loading: quranLoading } = useLoadSurahData();
  const { addLog, isCreating } = useAddLog();

  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState<"completed" | "partial" | "missed">(
    "completed",
  );
  const [notes, setNotes] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewed, setReviewed] = useState(false);

  const analytics = useMemo(() => {
    if (!plan || !surahData) return null;
    return hifzStatus(plan, surahData); 
  }, [plan, surahData]);

  const logContext = useMemo(() => {
    if (!plan || !surahData || !analytics) return null;

    const today = new Date();
    const dayNumber = (today.getDay() + 6) % 7;

    const targetInfo = getTargetPage(
      plan.selected_days,
      analytics.plannedPages,
      analytics.completedPages,
      plan.pages_per_day,
      dayNumber,
    );

    if (!targetInfo || targetInfo.totalTarget === 0) return null;

    const task = getTodayTask(plan, surahData, targetInfo.totalTarget);
    return {
      ...task,
      ...targetInfo,
    };
  }, [plan, surahData, analytics]);

  useEffect(() => {
    if(!logContext) return 
     setPages(logContext.totalTarget)
  }, [logContext]);

  useEffect(() => {
    if(!logContext) return
    if (pages >= logContext?.totalTarget) {
       setStatus("completed")
    } else if (pages === 0) {
      setStatus("missed")
    } else {
      setStatus("partial")
     }
  }, [pages, logContext?.target])


   const handleStatusSelection = (
     selectedStatus: "completed" | "partial" | "missed",
   ) => {
     if ( selectedStatus === "completed") {
       setPages(logContext?.totalTarget || 0);
     } else if (pages === 0 || selectedStatus === "missed") {
       setPages(0);
     } else {
       setPages(Math.max(1, Math.floor(logContext?.totalTarget || 1) / 2))
     }
   };
  

  if (planLoading || quranLoading) {
    return <LogProgressSkeleton />;
  }

  if (!plan) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-xl font-black text-slate-900 text-center">
            No Active Plan Found
          </Text>
          <Button className="mt-4" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </Screen>
    );
  }

  if (!logContext) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="cafe-outline" size={48} color="#276359" />
          <Text className="text-xl font-black text-slate-900 mt-4">
            Rest Day
          </Text>
          <Text className="text-slate-500 text-center mt-2">
            No task scheduled for today. Take a moment to revise!
          </Text>
          <Button className="mt-6" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </Screen>
    );
  }

  const handleSave = async () => {
    if (!plan || !logContext || isCreating || !plan.id || !logContext.startPage) return;

    try {
     const today = new Date();
     const logDay = (today.getDay() + 6) % 7;
     const actualTask = getTodayTask(plan, surahData, pages);

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
    } catch (err: any) {
      setErrorMessage(
        err.message,
      );
      setErrorVisible(true);
    }
  };

  return (
    <>
      <View className="bg-white border-b border-slate-100">
        <View className="h-16 px-4 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-100"
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>
          <Text className="text-lg font-black text-primary leading-tight ml-2">
            Log Progress
          </Text>
        </View>
      </View>
      <Screen>
        <ScreenContent>
          <View className="bg-primary p-6 rounded-[40px] mb-8 shadow-xl shadow-green-900/20">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Text className="text-white/70 font-bold text-[10px] uppercase tracking-[2px]">
                  {logContext.isPlannedDay ?
                    "Scheduled Session"
                  : "Recovery Session"}
                </Text>
              </View>
              <View className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Text className="text-white text-[9px] font-black uppercase tracking-widest">
                  {plan.direction}
                </Text>
              </View>
            </View>

            <Text className="text-white text-4xl font-black mb-6 tracking-tight">
              {logContext.displaySurah}
            </Text>

            <View className="bg-black/10 rounded-3xl p-5 border border-white/5">
              <View className="flex-row justify-between items-end mb-1">
                <View>
                  <Text className="text-white text-4xl font-black">
                    {logContext.totalTarget}
                    <Text className="text-white/50 text-xl font-medium">
                      {" "}
                      Pages
                    </Text>
                  </Text>
                  <Text className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">
                    Goal for today
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-white font-bold text-sm">
                    {logContext.startPage} — {logContext.endPage}
                  </Text>
                  <Text className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">
                    Range (Juz {logContext.juz})
                  </Text>
                </View>
              </View>

              <View className="flex-row mt-4 gap-x-5">
                {logContext.baseTarget > 0 && (
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                    <Text className="text-white/60 text-[9px] font-bold uppercase">
                      Daily: {logContext.baseTarget}
                    </Text>
                  </View>
                )}
                {logContext.catchUpAmount > 0 && (
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
                    <Text className="text-white/60 text-[9px] font-bold uppercase">
                      Extra: {logContext.catchUpAmount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View className="bg-white border border-slate-100 p-6 rounded-[32px] mb-6 flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Ionicons
                  name="library-outline"
                  size={18}
                  color="#276359"
                  className="mr-2"
                />
                <Text className="text-[#0f172a] text-lg font-black ml-2">
                  Revision
                </Text>
              </View>
              <Text className="text-slate-500 text-xs">
                Revise last 5 pages before memorizing
              </Text>
            </View>
            <Switch value={reviewed} onValueChange={setReviewed} />
          </View>

          <Text className="text-xl font-black text-gray-900 mb-4">
            How did it go?
          </Text>
          <View className="flex-row justify-between mb-8">
            <StatusTab
              label="Completed"
              icon="checkmark-circle"
              active={status === "completed"}
              onPress={() => handleStatusSelection("completed")}
            />
            <StatusTab
              label="Partial"
              icon="contrast"
              active={status === "partial"}
              onPress={() => handleStatusSelection("partial")}
            />
            <StatusTab
              label="Missed"
              icon="close-circle"
              active={status === "missed"}
              onPress={() => handleStatusSelection("missed")}
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
        <Alert
          visible={errorVisible}
          type="delete"
          title="Action Failed"
          message={errorMessage}
          confirmText="Try Again"
          cancelText="Close"
          onConfirm={() => {
            setErrorVisible(false);
          }}
          onCancel={() => setErrorVisible(false)}
        />
      </Screen>
    </>
  );
}
