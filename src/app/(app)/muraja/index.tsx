import { Button } from "@/src/components/ui/Button";
import UpcomingSessionCard from "@/src/features/muraja/components/UpcomingSessionCard";

import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { format } from "date-fns";

import { WeeklyMurajaSkeleton } from "@/src/features/muraja/components/skeletons";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { useMurajaOperation } from "@/src/features/muraja/hooks/useMurajaOperation";
import { WeeklyOverviewCard } from "@/src/features/muraja/components/WeeklyOverviewCard";
import { TodayMurajaCard } from "@/src/features/muraja/components/TodayMurajaCard";
import { ScreenContent, ScreenFooter } from "@/src/components/screen/ScreenContent";
import Screen from "@/src/components/screen/Screen";
import MurajaEmptyState from "@/src/features/muraja/components/MurajaEmptyState";
import { SectionHeader } from "@/src/components/SectionHeader";

export default function MurajaIndex() {
  const router = useRouter();
  const {
    weeklyPlan,
    plans,
    todayPlan,
    upcomingSessions,
    loading,
    refetch,
    error,
  } = useWeeklyMuraja();
  const { updateLog, isUpdating } = useMurajaOperation();

  if (loading)
    return (
      <Screen>
        <WeeklyMurajaSkeleton />
      </Screen>
    );
  
  if (!weeklyPlan) return (
    <Screen>
      <MurajaEmptyState/>
    </Screen>
  )

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

  const formattedStart = format(weeklyPlan.week_start_date, "MMM dd");
  const formattedEnd = format(weeklyPlan.week_end_date, "MMM dd");

  return (
    <Screen>
      <ScreenContent>
        <WeeklyOverviewCard
          weeklyPlan={weeklyPlan}
          dayCount={plans.length}
          dateRange={`${formattedStart} - ${formattedEnd}`}
        />

        <View className="mt-4 mb-4">
          <SectionHeader title="Today's Muraja'a" />
          {todayPlan ? (
            <TodayMurajaCard
              todayPlan={todayPlan}
              onStatusUpdate={(status) =>
                updateLog({ dayId: todayPlan.id, status })
              }
              isUpdating={isUpdating}
            />
          ) : (
            <View className="p-6 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
              <Text className="text-center text-gray-400 font-medium">
                No session scheduled for today.
              </Text>
            </View>
          )}
        </View>

        {upcomingSessions.length > 0 && (
          <View className="mt-4">
            <SectionHeader
              title="Upcoming Sessions"
              badge={`${upcomingSessions.length} Days`}
            />
            <UpcomingSessionCard upcomingSessions={upcomingSessions} />
          </View>
        )}
      </ScreenContent>
      <ScreenFooter>
        <Button className="" onPress={() => router.push("/(app)/create-muraja-plan")}>
          Replace Current Plan
        </Button>
      </ScreenFooter>
    </Screen>
  );
}
