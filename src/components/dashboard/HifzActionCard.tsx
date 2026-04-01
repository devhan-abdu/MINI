import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAddLog } from "@/src/features/hifz/hook/useAddLog";
import { useRouter } from "expo-router";
import { getTodayTask } from "@/src/features/hifz/utils/quran-logic";
import { IHifzPlan } from "@/src/features/hifz/types";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { useSession } from "@/src/hooks/useSession";
import { StatusButton } from "./StatusButton";
import { Alert } from "../common/Alert";
import { getTargetPage } from "@/src/features/hifz/utils/getTargetPage";

export const HifzActionCard = ({
  hifz,
  plannedPage,
  completedPage,
}: {
  hifz: IHifzPlan;
  plannedPage: number;
  completedPage: number;
}) => {
  const { addLog, isCreating } = useAddLog();
  const { items: surahData } = useLoadSurahData();
  const { user } = useSession();
  const router = useRouter();

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [warningVisible, setWarningVisible] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const dayNumber = (today.getDay() + 6) % 7;
  const todaysLog = hifz.hifz_daily_logs?.find((log) => log.date === todayStr);
  const currentStatus = todaysLog?.status || "pending";

  const targetInfo = getTargetPage(
    hifz.selected_days,
    plannedPage,
    completedPage,
    hifz.pages_per_day,
    dayNumber,
  );

  if (!targetInfo || targetInfo.totalTarget === 0) {
    return (
      <View className="bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-6 items-center">
        <Text className="text-slate-400   text-[10px] uppercase tracking-widest">
          Rest Day (No Hifz)
        </Text>
      </View>
    );
  }

  const todayTask = getTodayTask(hifz, surahData, targetInfo.totalTarget);

  if (!todayTask)
    return (
      <View className="bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-6 items-center">
        <Text className="text-slate-400   text-[10px] uppercase tracking-widest">
          Rest Day (No Hifz)
        </Text>
      </View>
    );

  const handleStatusChange = async (status: "completed" | "missed") => {
    if (!hifz || !todayTask || isCreating || !hifz.id) return;

    const payload = {
      hifz_plan_id: hifz.id!,
      actual_pages_completed: status === "completed" ? hifz.pages_per_day : 0,
      actual_start_page: todayTask.startPage,
      actual_end_page: todayTask.endPage,
      status,
      date: todayStr,
      log_day: dayNumber,
    };
    try {
      await addLog({ todayLog: payload, userId: user?.id });
    } catch (err) {
      setErrorMessage(
        "Could not save your progress. Please check your connection.",
      );
      setErrorVisible(true);
    }
  };

  const onStatusPress = (status: "completed" | "missed") => {
    if (status === "missed" && todaysLog?.status === "completed") {
      setWarningVisible(true);
    } else {
      handleStatusChange(status);
    }
  };

  return (
    <View
      className={`rounded-[32px] p-6 border ${!targetInfo.isPlannedDay ? "bg-amber-50/50 border-amber-100" : "bg-white border-slate-200"} shadow-md shadow-slate-200`}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-slate-900  text-xl tracking-tight">
              {todayTask.displaySurah}
            </Text>
            {!targetInfo.isPlannedDay && (
              <View className="bg-amber-100 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-amber-700 text-[8px]  uppercase">
                  Rest Day
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center">
            <Text className="text-slate-400 text-[10px]  uppercase tracking-[1.5px]">
              Pages {todayTask.startPage}–{todayTask.endPage}
            </Text>
            {targetInfo.catchUpAmount > 0 && (
              <Text className="text-primary text-[10px]  uppercase tracking-[1.5px] ml-2">
                (+{targetInfo.catchUpAmount} Catch up)
              </Text>
            )}
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/(app)/hifz/log")}
          className="w-10 h-10 items-center justify-center rounded-full bg-primary"
        >
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </Pressable>
      </View>

      {targetInfo.catchUpAmount > 0 && (
        <View className="bg-slate-50 rounded-2xl p-3 mb-5 flex-row items-center">
          <Ionicons name="sparkles" size={14} color="#276359" />
          <Text className="text-slate-500 text-[11px] ml-2 ">
            {targetInfo.isPlannedDay ?
              `Included ${targetInfo.catchUpAmount} extra pages to help you stay on track.`
            : `Focusing on ${targetInfo.catchUpAmount} pages today to clear your backlog.`
            }
          </Text>
        </View>
      )}

      <View className="flex-row gap-2">
        <StatusButton
          label={targetInfo.isPlannedDay ? "Done" : "Catch Up"}
          icon="checkmark-circle"
          activeColor="bg-primary"
          isDisabled={currentStatus === "completed"}
          isActive={currentStatus === "completed"}
          onPress={() => onStatusPress("completed")}
          loading={isCreating}
        />
        {targetInfo.isPlannedDay && (
          <StatusButton
            label="Skip"
            icon="close-circle"
            activeColor="bg-red-600"
            isDisabled={currentStatus === "missed"}
            isActive={currentStatus === "missed"}
            onPress={() => onStatusPress("missed")}
            loading={isCreating}
          />
        )}
      </View>

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
      <Alert
        visible={warningVisible}
        type="warning"
        title="Overwrite Progress?"
        message="You already marked today as completed. Skipping now will delete your saved pages for today. Continue?"
        confirmText="Yes, Skip"
        cancelText="Keep Progress"
        onConfirm={() => {
          setWarningVisible(false);
          handleStatusChange("missed");
        }}
        onCancel={() => {
          setWarningVisible(false);
        }}
      />
    </View>
  );
};
