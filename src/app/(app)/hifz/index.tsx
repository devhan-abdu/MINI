import Screen from "@/src/components/screen/Screen";
import { ScreenContent, ScreenFooter } from "@/src/components/screen/ScreenContent";
import { Button } from "@/src/components/ui/Button";
import { DayByDay } from "@/src/features/hifz/components/DayByDay";
import HifzEmptyState from "@/src/features/hifz/components/HifzEmptyState";
import HifzOverViewCard from "@/src/features/hifz/components/HifzOverviewCard";
import { HifzTrackerSkeleton } from "@/src/features/hifz/components/skeleton";
import StatCard from "@/src/features/hifz/components/StatCard";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { getPerformance, hifzStatus } from "@/src/features/hifz/utils";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

export default function Hifz() {
  const { hifz, isLoading, error, refetch } = useGetHifzPlan();
  const { items: surah } = useLoadSurahData();

  const analytics = useMemo(() => {
    return hifzStatus(hifz ?? null, surah);
  }, [hifz, surah]);

  if (isLoading) return <HifzTrackerSkeleton />;
  if (!hifz || !analytics) return <HifzEmptyState />;

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

  const config = getPerformance(
    analytics.plannedPages - analytics.actualPagesDone
  );

  return (
    <>
      <Tabs.Screen
        options={{
          headerTitle: () => (
            <View className="ml-1">
              <Text className="text-gray-400 font-bold uppercase tracking-[2px] text-[9px]">
                Hifz
              </Text>
              <Text className="text-xl font-black text-gray-900 leading-tight">
                Plan Tracker
              </Text>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/(app)/create-hifz-plan")}
              className="mr-4 bg-gray-100 flex-row items-center px-3 py-2 rounded-xl border border-gray-200 active:bg-gray-200"
            >
              <Ionicons name="settings-outline" size={14} color="#276359" />
              <Text className="text-primary font-black text-[10px] ml-2 uppercase tracking-tighter">
                Edit Plan
              </Text>
            </Pressable>
          ),
          headerShadowVisible: true,
        }}
      />
      <Screen>
        <ScreenContent>
          <View className="bg-primary rounded-[32px] p-6 shadow-xl shadow-black/10 border border-white/10">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white/70 font-bold uppercase tracking-widest text-[10px] mb-1">
                  Current Goal
                </Text>
                <Text className="text-white text-3xl font-black mb-2">
                  Daily Hifz
                </Text>

                <View
                  className={`flex-row items-center px-3 py-1 rounded-full mr-auto ${config.bg}`}
                >
                  <View
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${config.dot}`}
                  />
                  <Text
                    className={`font-bold text-[11px] uppercase tracking-wider ${config.color}`}
                  >
                    {config.value === 0
                      ? config.label
                      : `${Math.abs(config.value)} Pages ${config.label}`}
                  </Text>
                </View>
              </View>

              <HifzOverViewCard
                progress={analytics.accuracy}
                pages={`${analytics.startPage} - ${analytics.endPage}`}
                surahName={analytics.endSurah}
                strokeWidth={10}
              />
            </View>

            <View className="flex-row items-center border-t border-white/10 pt-5">
              <View className="pr-6 mr-6 border-r border-white/10">
                <Text className="text-white text-3xl font-black">
                  {analytics.todayTarget}
                </Text>
                <Text className="text-white/60 text-[10px] font-bold uppercase">
                  Daily Pages
                </Text>
              </View>

              <View>
                <Text className="text-white text-lg font-black">
                  {analytics.targetEndDate}
                </Text>
                <Text className="text-white/60 text-[10px] font-bold uppercase">
                  Target End Date
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-8 mb-3E4TG5T4F5RF5RF4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Weekly Consistency
            </Text>
            <DayByDay plan={hifz} />
          </View>
          <View className="flex-row flex-wrap justify-between mt-4">
            <StatCard
              title="Completed"
              value={analytics.successLogs}
              unit="Pages"
              type="success"
              icon="checkmark-done-circle"
            />
            <StatCard
              title="Remaining"
              value={analytics.remainingPages}
              unit="Pages"
              type="info"
              icon="book"
            />
            <StatCard
              title="Accuracy"
              value={analytics.accuracy}
              unit="Score"
              type="warning"
              icon="trophy"
            />
            <StatCard
              title="Missed"
              value={analytics.missedCount}
              unit="Days"
              type="danger"
              icon="alert-circle"
            />
          </View>
          <View className="mt-10 bg-primary/5 p-6 rounded-[32px] border border-dashed border-primary/30">
            <Ionicons name="bulb" size={24} color="#276359" className="mb-2" />
            <Text className="text-primary-900 font-bold text-lg mb-2 italic">
              "The best among you are those who learn the Quran and teach it."
            </Text>
            <Text className="text-primary/60 text-sm">
              — Prophet Muhammad (ﷺ)
            </Text>
          </View>
        </ScreenContent>
        <ScreenFooter>
          <Pressable
            className="bg-primary h-14 rounded-2xl px-4 flex-row items-center justify-start shadow-lg shadow-primary/20 active:opacity-90"
            onPress={() => router.push(`/(app)/hifz/log`)}
          >
            <View className="bg-white/20 p-1.5 rounded-full mr-3">
              <Ionicons name="add" size={20} color="white" />
            </View>

            <Text className="text-white font-black text-lg tracking-tight">
              Log Today's Hifz
            </Text>

            <Ionicons
              name="arrow-forward"
              size={24}
              color="#fff"
              className="ml-auto"
            />
          </Pressable>
        </ScreenFooter>
      </Screen>
    </>
  );
}
