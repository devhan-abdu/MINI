import ScreenWrapper from "@/src/components/ScreenWrapper";
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
      <ScreenWrapper>
        <WeeklyMurajaSkeleton />
      </ScreenWrapper>
    );

  if (error || !weeklyPlan) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-gray-500 mb-4">
            {error ? "Failed to load plan" : "No active weekly plan found."}{" "}
          </Text>
          {error ? (
            <Button onPress={() => refetch()}>Retry</Button>
          ) : (
            <Button onPress={() => router.push("/create-plan")}>
              Create Plan
            </Button>
          )}
        </View>
      </ScreenWrapper>
    );
  }

  const formattedStart = format(weeklyPlan.week_start_date, "MMM dd");
  const formattedEnd = format(weeklyPlan.week_end_date, "MMM dd");

  return (
    <ScreenWrapper>
      <View className="mb-6 ">
        <Text className="text-3xl font-bold text-gray-900">This Week Plan</Text>
        <Text className=" text-gray-500">
          For this week of {formattedStart} - {formattedEnd}
        </Text>
      </View>

      <WeeklyOverviewCard weeklyPlan={weeklyPlan} dayCount={plans.length} />

      {todayPlan ? (
        <View className="mb-8">
          <Text className="font-bold text-xl mb-4">Today's Muraja'a</Text>
          <TodayMurajaCard
            todayPlan={todayPlan}
            onStatusUpdate={(status) =>
              updateLog({ dayId: todayPlan.id, status })
            }
            isUpdating={isUpdating}
          />
        </View>
      ) : (
        <View className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mb-8">
          <Text className="text-center text-gray-500">
            No session scheduled for today.
          </Text>
        </View>
      )}

      {upcomingSessions.length > 0 && (
        <View className="mb-8">
          <Text className="font-bold text-xl mb-4">Upcoming Sessions</Text>
          <UpcomingSessionCard upcomingSessions={upcomingSessions} />
        </View>
      )}

      {!todayPlan && upcomingSessions.length === 0 && (
        <Text className="text-gray-400 italic text-center mt-8">
          No Upcoming plan for this week
        </Text>
      )}

      <Button
        className="mb-8 mt-auto"
        onPress={() => router.push("/(app)/create-plan")}
      >
        Replace Current Plan
      </Button>
    </ScreenWrapper>
  );
}
