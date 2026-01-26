import { TodayTasksSection } from "@/src/components/dashboard/TodayTask";
import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { View,Text } from "react-native";
import { Redirect } from "expo-router";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import Card from "@/src/components/dashboard/Card";
import StatCard from "@/src/features/hifz/components/StatCard";
import { DashboardSkeleton } from "@/src/components/dashboard/Skeleton";
import { Header } from "@/src/components/navigation/Header";
import { hifzStatus } from "@/src/features/hifz/utils/plan-status";
import { useMemo } from "react";
import { useHistory } from "@/src/features/muraja/hooks/useHistory";

export default function Dashboard() {
  const { items: surah, loading } = useLoadSurahData();
  const { hifz: hifzPlan, isLoading: loadingHifz } = useGetHifzPlan();
  const { weeklyPlan: murajaPlan, loading: loadingMuraja } = useWeeklyMuraja();

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const { analytics } = useHistory(year, month);

 const hifzAnalytics = useMemo(() => {
   if (!hifzPlan || !surah.length) return null;
   return hifzStatus(hifzPlan, surah);
 }, [hifzPlan, surah]);

  if (loadingHifz || loadingMuraja || loading) return <DashboardSkeleton />;

  if (!hifzPlan && !murajaPlan) {
    return <Redirect href="/(app)/onboarding" />;
  }


  return (
    <>
      <Header title="Home" />
      <Screen>
        <ScreenContent>
          <Card
            hifzAnalytics={hifzAnalytics ?? null}
            murajaPlan={murajaPlan ?? null}
            surah={surah}
          />
          <View className="mt-10 px-1">
            <Text className="text-gray-400 font-bold uppercase tracking-[2px] text-[10px] mb-2">
              Insights
            </Text>
            <Text className="text-2xl font-black text-slate-900 mb-6">
              Plan Analytics
            </Text>

            <View className="flex-row flex-wrap justify-between">
              <StatCard
                category="Hifz"
                title="Remaining"
                value={hifzAnalytics?.remainingPages ?? 0}
                unit="Pages"
                icon="book-outline"
                type="hifz"
              />
              <StatCard
                category="Hifz"
                title="Days Left"
                value={hifzAnalytics?.daysNeeded ?? 0}
                unit="Days"
                icon="calendar-outline"
                type="hifz"
              />

              <StatCard
                category="Muraja"
                title="Streak"
                value={analytics?.longestStreak ?? 0}
                unit="Days"
                icon="flame-outline"
                type="muraja"
              />
              <StatCard
                category="Muraja"
                title="Completion"
                value={analytics?.completionRate ?? 0}
                unit="%"
                icon="checkmark-circle-outline"
                type="muraja"
              />
            </View>
          </View>

          <View className="mt-6  px-1">
            <Text className="text-gray-400 font-bold uppercase tracking-[2px] text-[10px] mb-2">
              Focus
            </Text>

            <Text className="text-xl font-black text-gray-900 mb-5">
              Today's Task
            </Text>

            <TodayTasksSection surahData={surah} />
          </View>
        </ScreenContent>
      </Screen>
    </>
  );
}
