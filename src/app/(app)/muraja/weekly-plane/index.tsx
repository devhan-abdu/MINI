import WeeklyPlanCard from "@/src/features/muraja/components/WeeklyPlaneCard";
import { View } from "react-native";
import { TodaySkeleton } from "@/src/features/muraja/components/skeletons";
import Progress from "@/src/components/Progress";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { useMemo } from "react";
import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";
import MurajaEmptyState from "@/src/features/muraja/components/MurajaEmptyState";
import { SectionHeader } from "@/src/components/SectionHeader";

export default function WeeklyPlan() {
  const { weeklyPlan, plans, todayPlan, upcomingSessions, loading } =
    useWeeklyMuraja();

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
      <Screen>
        <ScreenContent>
          {[1, 2, 3, 4].map((i) => (
            <TodaySkeleton key={i} />
          ))}
        </ScreenContent>
      </Screen>
    );
  }
  if (!weeklyPlan || !plans) {
    return (
      <Screen>
        <MurajaEmptyState />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenContent>
        <Progress completionRate={progressPercentage} />

        {todayPlan && (
          <View className="mb-6">
            <SectionHeader title="Focus Today" />
            <WeeklyPlanCard plan={todayPlan} isHero={true} />
          </View>
        )}

        {upcomingSessions.length > 0 && (
          <View className="mb-6">
            <SectionHeader title="Next Sessions" />
            {upcomingSessions.map((plan) => (
              <WeeklyPlanCard key={plan.id} plan={plan} />
            ))}
          </View>
        )}

        {pastPlans.length > 0 && (
          <View className="mb-6 opacity-70">
            <SectionHeader title="Completed History" />
            {pastPlans.map((plan) => (
              <WeeklyPlanCard key={plan.id} plan={plan} />
            ))}
          </View>
        )}
      </ScreenContent>
    </Screen>
  );
}
