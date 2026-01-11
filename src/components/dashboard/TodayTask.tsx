import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { hifzStatus } from "@/src/features/hifz/utils/plan-status";
import { HifzActionCard } from "./HifzActionCard";
import { MurajaActionCard } from "./MurajaActionCard";
import { CardSkeleton } from "./Skeleton";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { ISurah } from "@/src/types";

export const TodayTasksSection = ({ surahData }: { surahData: ISurah[] }) => {

  const { todayPlan, loading: murajaLoading } = useWeeklyMuraja();
  const { hifz, isLoading: hifzLoading, nextTask } = useGetHifzPlan();

  const hifzAnalytics = useMemo(() => {
    return hifzStatus(hifz ?? null, surahData);
  }, [hifz, surahData]);

  if(!hifz)  return 
  if (murajaLoading || hifzLoading) {
      return [1, 2].map((index) => <CardSkeleton key={index} />);
  }


  return (
    <View className="gap-y-4">
      {hifzAnalytics ? (
        <HifzActionCard hifz={hifz} nextTask={ nextTask} />
      ) : (
        <EmptyTask message="No Hifz Plan for Today" />
      )}

      {todayPlan ? (
        <MurajaActionCard todayPlan={todayPlan} />
      ) : (
        <EmptyTask message="Rest Day (No Muraja)" />
      )}
    </View>
  );
};

const EmptyTask = ({ message }: { message: string }) => (
  <View className="bg-slate-50 border border-dashed border-slate-200 rounded-[24px] p-6 items-center">
    <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
      {message}
    </Text>
  </View>
);
