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

export const HifzActionCard = ({ hifz }: { hifz: IHifzPlan }) => {
  const { addLog, isCreating } = useAddLog();
  const { items: surahData } = useLoadSurahData();
  const { user } = useSession();
  const router = useRouter();

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [warningVisible, setWarningVisible] = useState(false);

  const todayTask = getTodayTask(hifz, surahData);

  if (!todayTask) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysLog = hifz.hifz_daily_logs?.find((log) => log.date === todayStr);
  const currentStatus = todaysLog?.status || "pending";

  const handleStatusChange = async (status: "completed" | "missed") => {
    if (!hifz || !todayTask || isCreating || !hifz.id) return;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const logDay = today.getDay();

    const payload = {
      hifz_plan_id: hifz.id!,
      actual_pages_completed: status === "completed" ? hifz.pages_per_day : 0,
      actual_start_page: todayTask.startPage,
      actual_end_page: todayTask.endPage,
      status,
      date: todayStr,
      log_day: logDay,
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
    <View className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-md shadow-slate-200">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1">
          <Text className="text-slate-900 font-black text-xl tracking-tight">
            {todayTask.displaySurah}
          </Text>
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[1.5px] mt-1">
            Hifz: Pages {todayTask.startPage}–{todayTask.endPage}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/(app)/hifz/log")}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-primary/95 bg-primary"
        >
          <Ionicons name="create-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        <StatusButton
          label="Done"
          icon="checkmark-circle"
          activeColor="bg-primary"
          isDisabled={currentStatus === "completed"}
          isActive={currentStatus === "completed"}
          onPress={() => onStatusPress("completed")}
          loading={isCreating}
        />

        <StatusButton
          label="Skip"
          icon="close-circle"
          activeColor="bg-red-600"
          isDisabled={currentStatus === "missed"}
          isActive={currentStatus === "missed"}
          onPress={() => onStatusPress("missed")}
          loading={isCreating}
        />
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
