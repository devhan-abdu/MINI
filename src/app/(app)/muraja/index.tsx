import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { format } from "date-fns";

import Screen from "@/src/components/screen/Screen";
import {
  ScreenContent,
  ScreenFooter,
} from "@/src/components/screen/ScreenContent";
import { Button } from "@/src/components/ui/Button";
import { SectionHeader } from "@/src/components/SectionHeader";

import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { useWeeklyReview } from "@/src/features/muraja/hooks/useWeeklyReview";
import { useMurajaOperation } from "@/src/features/muraja/hooks/useMurajaOperation";

import { WeeklyOverviewCard } from "@/src/features/muraja/components/WeeklyOverviewCard";
import { TodayMurajaCard } from "@/src/features/muraja/components/TodayMurajaCard";
import UpcomingSessionCard from "@/src/features/muraja/components/UpcomingSessionCard";
import MurajaReviewPage from "@/src/features/muraja/components/MurajaReviewPage";
import { WeeklyMurajaSkeleton } from "@/src/features/muraja/components/skeletons";
import MurajaEmptyState from "@/src/features/muraja/components/MurajaEmptyState";

export default function MurajaIndex() {
const router = useRouter();
  const { weeklyPlan, plans, todayPlan, upcomingSessions, loading, error, refetch } = useWeeklyMuraja();
  const { analytics, plan: reviewPlan, isLoading: loadingReview } = useWeeklyReview();
  const { updateLog, isUpdating } = useMurajaOperation();


  if (loading || loadingReview) return <Screen><WeeklyMurajaSkeleton /></Screen>;
  
  if (error) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-slate-500 mb-4">Failed to load plans</Text>
          <Button onPress={() => refetch()}>Try Again</Button>
        </View>
      </Screen>
    );
  }


  if (weeklyPlan) {
    const dateRange = `${format(
      new Date(weeklyPlan.week_start_date),
      "MMM dd"
    )} - ${format(new Date(weeklyPlan.week_end_date), "MMM dd")}`;

    return (
      <Screen>
        <ScreenContent>
          <WeeklyOverviewCard
            weeklyPlan={weeklyPlan}
            dayCount={plans.length}
            dateRange={dateRange}
          />

          <View className="mt-6 mb-4">
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
              <View className="p-8 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                <Text className="text-center text-slate-400 font-medium">
                  No session scheduled for today.
                </Text>
              </View>
            )}
          </View>

          {upcomingSessions.length > 0 && (
            <View className="mt-4">
              <SectionHeader
                title="Upcoming"
                badge={`${upcomingSessions.length} Days`}
              />
              <UpcomingSessionCard upcomingSessions={upcomingSessions} />
            </View>
          )}
        </ScreenContent>
        <ScreenFooter>
          <Button
            variant="outline"
            onPress={() => router.push("/(app)/create-muraja-plan")}
          >
            Replace Current Plan
          </Button>
        </ScreenFooter>
      </Screen>
    );
  }

if (analytics && reviewPlan) {
  return <MurajaReviewPage plan={reviewPlan} analytics={analytics} />;
}

 return (
   <Screen>
     <MurajaEmptyState />
   </Screen>
 );
}
