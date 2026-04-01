import { HifzActionCard } from "@/src/components/dashboard/HifzActionCard";
import Screen from "@/src/components/screen/Screen";
import {
  ScreenContent,
  ScreenFooter,
} from "@/src/components/screen/ScreenContent";
import { Button } from "@/src/components/ui/Button";
import { DayByDay } from "@/src/features/hifz/components/DayByDay";
import HifzEmptyState from "@/src/features/hifz/components/HifzEmptyState";
import HifzOverViewCard from "@/src/features/hifz/components/HifzOverviewCard";
import { HifzTrackerSkeleton } from "@/src/features/hifz/components/skeleton";
import StatCard from "@/src/features/hifz/components/StatCard";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { getPerformance } from "@/src/features/hifz/utils/plan-calculations";
import { hifzStatus } from "@/src/features/hifz/utils/plan-status";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/common/ui/Text";

export default function Hifz() {
  const { hifz, isLoading, error, refetch } = useGetHifzPlan();
  const { items: surah } = useLoadSurahData();

  const analytics = useMemo(() => {
    if (!hifz || !surah) return null;
    return hifzStatus(hifz, surah);
  }, [hifz, surah]);

  if (isLoading || (hifz && !analytics)) {
    return <HifzTrackerSkeleton />;
  }
  if (error) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-gray-500 mb-4">
            Failed to load plan
          </Text>
          <Button onPress={() => refetch()}>Retry</Button>
        </View>
      </Screen>
    );
  }
  if (!hifz) return <HifzEmptyState />;
  if (!analytics) return <HifzTrackerSkeleton />;

  const config = getPerformance(
    analytics.plannedPages - analytics.completedPages,
  );

  return (
    <>
      <Screen>
        <ScreenContent>
          <View className="bg-primary rounded-[32px] p-6 shadow-xl shadow-black/10 border border-white/10">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white/70   uppercase tracking-widest text-[10px] mb-1">
                  Current Goal
                </Text>
                <Text className="text-white text-3xl  mb-2">Daily Hifz</Text>

                <View
                  className={`flex-row items-center px-3 py-1 rounded-full mr-auto ${config.bg}`}
                >
                  <View
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${config.dot}`}
                  />
                  <Text
                    className={`  text-[11px] uppercase tracking-wider ${config.color}`}
                  >
                    {config.value === 0 ?
                      config.label
                    : `${Math.abs(config.value)} Pages ${config.label}`}
                  </Text>
                </View>
              </View>

              <HifzOverViewCard
                progress={analytics.progress}
                remainingPages={analytics.remainingPages}
                currentSurah={analytics.currentSurah}
                strokeWidth={10}
              />
            </View>

            <View className="flex-row items-center border-t border-white/10 pt-5">
              <View className="pr-6 mr-6 border-r border-white/10">
                <Text className="text-white text-3xl ">
                  {analytics.todayTarget}
                </Text>
                <Text className="text-white/60 text-[10px]   uppercase">
                  Daily Pages
                </Text>
              </View>

              <View>
                <Text className="text-white text-lg ">
                  {analytics.targetEndDate}
                </Text>
                <Text className="text-white/60 text-[10px]   uppercase">
                  Target End Date
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-10">
            <Text className="text-gray-400   uppercase tracking-[2px] text-[10px] mb-2 px-1">
              Focus
            </Text>
            <Text className="text-xl  text-gray-900 mb-4 px-1">Today Hifz</Text>
            <HifzActionCard
              hifz={hifz}
              plannedPage={analytics.plannedPages}
              completedPage={analytics.completedPages}
            />
          </View>
          <View className="mt-10 mb-2 px-1">
            <Text className="text-gray-400   uppercase tracking-[2px] text-[10px] mb-2">
              Activity
            </Text>

            <Text className="text-xl  text-gray-900 mb-5">
              Weekly Consistency
            </Text>

            <DayByDay plan={hifz} />
          </View>
          <View className="mt-10">
            <Text className="text-gray-400   uppercase tracking-[2px] text-[10px] mb-2 px-1">
              Insights
            </Text>
            <Text className="text-xl  text-gray-900 mb-4 px-1">
              Plan Analytics
            </Text>

            <View className="flex-row flex-wrap justify-between">
              <StatCard
                title="Completed"
                value={analytics.completedPages}
                unit="Pages"
                icon="checkmark-done-circle-outline"
              />
              <StatCard
                title="Remaining"
                value={analytics.remainingPages}
                unit="Pages"
                icon="book-outline"
              />
              <StatCard
                title="Accuracy"
                value={analytics.accuracy}
                unit="Score"
                icon="trophy-outline"
              />
              <StatCard
                title="Missed"
                value={analytics.missedCount}
                unit="Days"
                type="danger"
                icon="alert-circle-outline"
              />
            </View>
          </View>
        </ScreenContent>
        <ScreenFooter>
          <View className="flex-row gap-x-3">
            <Pressable
              className="flex-1 bg-primary h-14 rounded-2xl px-4 flex-row items-center justify-start shadow-lg shadow-primary/20 active:opacity-90"
              onPress={() => router.push(`/(app)/hifz/log`)}
            >
              <View className="bg-white/20 p-1.5 rounded-full mr-3">
                <Ionicons name="add" size={20} color="white" />
              </View>
              <Text className="text-white  text-lg tracking-tight">
                Log Today's Hifz
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-white h-14 rounded-2xl px-4 flex-row items-center justify-start border border-primary shadow-sm active:opacity-90"
              onPress={() => router.push("/(app)/hifz/create-hifz-plan")}
            >
              <View className="bg-primary/10 p-1.5 rounded-full mr-3">
                <Ionicons name="create-outline" size={18} color="#276359" />
              </View>
              <Text className="text-primary   text-lg tracking-tight">
                Edit Plan
              </Text>
            </Pressable>
          </View>
        </ScreenFooter>
      </Screen>
    </>
  );
}
