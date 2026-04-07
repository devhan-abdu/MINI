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
import { ActionTaskCard } from "../common/ActionCard";

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

  const onToggleStatus = () => {
    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    handleStatusChange(nextStatus as any);
  };

  return (
    <>
      <ActionTaskCard
        typeLabel="Hifz"
        title={todayTask.displaySurah ?? ""}
        subTitle={`Pages ${todayTask.startPage} – ${todayTask.endPage}`}
        isCatchup={targetInfo.catchUpAmount > 0}
        isCompleted={currentStatus === "completed"}
        isLoading={isCreating}
        onDone={onToggleStatus}
        logRoute="/hifz/log"
      />

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
    </>
  );
};
