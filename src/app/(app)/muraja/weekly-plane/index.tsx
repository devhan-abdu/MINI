import ScreenWrapper from "@/src/components/ScreenWrapper";
import WeeklyPlanCard from "@/src/components/WeeklyPlaneCard";
import { useSession } from "@/src/hooks/useSession";
import { useWeeklyDays } from "@/src/hooks/useWeeklyDays";
import { useWeeklyPlan } from "@/src/hooks/useWeeklyPlan";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { fullDayNames } from "@/src/lib/utils";
import { TodaySkeleton } from "@/src/components/skeletons";

export default function WeeklyPlan() {
  const router = useRouter();
  const { user } = useSession();
  const { weeklyPlan } = useWeeklyPlan(user?.id ?? null);
  const { plans, todayPlan, upcomingSessions, loading } = useWeeklyDays(
    user?.id ?? null,
    weeklyPlan?.id ?? null
  );

  if (!weeklyPlan || !plans) return null;

  const today = new Date().toISOString().slice(0, 10);
  const pastPlans = plans.filter((p) => p.date < today && p.date !== today);
  const completedPlanCount = plans.filter(
    (p) => p.status === "completed"
  ).length;
  const progressPercentage = Math.min(
    100,
    Math.max(0, (completedPlanCount / plans.length) * 100)
  );

  return (
    <ScreenWrapper>
      <View className="bg-white p-4 rounded-lg border border-gray-200 flex-col gap-4 mb-12">
        <Text className="text-semibold text-lg">This Week's Progress</Text>
        <View className={`overflow-hidden rounded-full h-4 bg-gray-400 w-full`}>
          <View
            className="h-full rounded-full"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: "#276359",
            }}
          ></View>
        </View>
        <Text>
          {completedPlanCount} of {plans.length} Days Completed
        </Text>
      </View>
      {loading ? (
        <>
          {[1, 2, 3, 4, 5].map((i) => (
            <TodaySkeleton key={i} />
          ))}
        </>
      ) : (
        <>
          {todayPlan && (
            <>
              <Text className="text-2xl font-bold mb-4">Today</Text>
              <WeeklyPlanCard
                planId={todayPlan.id ?? null}
                day={fullDayNames[todayPlan.day_of_week]}
                date={todayPlan.date}
                status={todayPlan.status}
                startSurah={todayPlan.startSurah}
                endSurah={todayPlan.endSurah}
                logId={todayPlan.log_id}
                pages={weeklyPlan?.planned_pages}
                minutes={weeklyPlan?.estimated_time_min}
                startPage={todayPlan.planned_start_page}
                endPage={todayPlan.planned_end_page}
              />
            </>
          )}
          {pastPlans.length > 0 && (
            <>
              <Text className="text-2xl font-bold my-4">Past</Text>
              {pastPlans.map((plan) => (
                <WeeklyPlanCard
                  key={plan.id}
                  planId={plan.id ?? null}
                  day={fullDayNames[plan.day_of_week]}
                  date={plan.date}
                  status={plan.status}
                  startSurah={plan.startSurah}
                  endSurah={plan.endSurah}
                  logId={plan.log_id}
                  pages={weeklyPlan?.planned_pages}
                  minutes={weeklyPlan?.estimated_time_min}
                  startPage={plan.planned_start_page}
                  endPage={plan.planned_end_page}
                />
              ))}
            </>
          )}
          {upcomingSessions.length > 0 && (
            <>
              <Text className="text-2xl font-bold my-4">Upcoming</Text>
              {upcomingSessions.map((plan) => (
                <WeeklyPlanCard
                  key={plan.id}
                  planId={plan.id ?? null}
                  day={fullDayNames[plan.day_of_week]}
                  date={plan.date}
                  status={plan.status}
                  startSurah={plan.startSurah}
                  endSurah={plan.endSurah}
                  logId={null}
                  pages={weeklyPlan?.planned_pages}
                  minutes={weeklyPlan?.estimated_time_min}
                  startPage={plan.planned_start_page}
                  endPage={plan.planned_end_page}
                />
              ))}
            </>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}
