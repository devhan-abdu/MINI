import ScreenWrapper from "@/src/components/ScreenWrapper";
import WeeklyPlanCard from "@/src/features/muraja/components/WeeklyPlaneCard";
import { ScrollView, Text, View, RefreshControl } from "react-native";
import { TodaySkeleton } from "@/src/features/muraja/components/skeletons";
import Progress from "@/src/components/Progress";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { useMemo } from "react";

export default function WeeklyPlan() {
  const {
    weeklyPlan,
    plans,
    todayPlan,
    upcomingSessions,
    loading,
    refetch,
  } = useWeeklyMuraja();

  if (!weeklyPlan || !plans) return null;

  const pastPlans = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return plans.filter((p) => p.date < today && p.date !== today);
  }, [plans]);

  const progressPercentage = useMemo(() => {
    if (!plans.length) return 0;
    const completed = plans.filter((p) => p.status === "completed").length;
    return (completed / plans.length) * 100;
  }, [plans]);

  if (loading && !plans.length) {
    return (
      <ScreenWrapper>
        {[1, 2, 3, 4].map((i) => (
          <TodaySkeleton key={i} />
        ))}
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <View className="mb-6">
          <Text className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-1">
            Weekly Progress
          </Text>
          <Progress completionRate={progressPercentage} />
        </View>

        {todayPlan && (
          <View className="mb-6">
            <Text className="text-xl font-bold mb-4 text-gray-800">Today</Text>
            <WeeklyPlanCard key={todayPlan.id} plan={todayPlan} />
          </View>
        )}

        {upcomingSessions.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold mb-4 text-gray-800">
              Upcoming
            </Text>
            {upcomingSessions.map((plan) => (
              <WeeklyPlanCard key={plan.id} plan={plan} />
            ))}
          </View>
        )}

        {pastPlans.length > 0 &&
           <View className="mb-6">
            <Text className="text-xl font-bold mb-4 text-gray-800">
              History
            </Text>
            {pastPlans.map((plan) => (
              <WeeklyPlanCard key={plan.id} plan={plan} />
            ))}
          </View>
        }
      </ScrollView>
    </ScreenWrapper>
  );
}
