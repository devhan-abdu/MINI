import { TodaySkeleton } from "@/src/features/muraja/components/skeletons";
import { WeeklyOverviewCard } from "@/src/features/muraja/components/WeeklyOverviewCard";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { format } from "date-fns";
import {Text,View } from "react-native";
import { SectionSkeleton } from "./Skeleton";
import { SectionHeader } from "../SectionHeader";

export function MurajaSection() {
  const { weeklyPlan, plans, loading, error } = useWeeklyMuraja();

  if (loading) return <SectionSkeleton />;
  if (error || !weeklyPlan) return ;

  const dateRange = `${format(
    new Date(weeklyPlan.week_start_date),
    "MMM dd"
  )} - ${format(new Date(weeklyPlan.week_end_date), "MMM dd")}`;

  return (
    <View>
      <SectionHeader title="Muraja Plan" />
      <WeeklyOverviewCard
        weeklyPlan={weeklyPlan}
        dayCount={plans?.length || 0}
        dateRange={dateRange}
      />
    </View>
  );
}
