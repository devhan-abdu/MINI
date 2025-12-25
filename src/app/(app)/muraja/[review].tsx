import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Progress from "@/src/components/Progress";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Button } from "@/src/components/ui/Button";
import { useSession } from "@/src/hooks/useSession";
import { IWeeklyPlan } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { getWeeklyReviewData } from "@/src/services";
import { computeWeeklyReview } from "@/src/lib/analytics";
import { formatWeekRange } from "@/src/lib/utils";
import { DayByDay } from "@/src/components/DayByDay";
import { ReviewSkeleton } from "@/src/components/skeletons";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyReviewPage() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { user } = useSession();
  const userId = user?.id || null;

  const [planData, setPlanData] = useState<IWeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getWeeklyReviewData(
        userId ?? null,
        planId ? Number(planId) : undefined
      );
      setPlanData(data);
      setLoading(false);
    };

    loadData();
  }, [planId]);

  const analytics = useMemo(() => {
    if (!planData) return null;

    return computeWeeklyReview(planData);
  }, [planData]);

  if (!userId) return;

  if (loading) {
    return <ReviewSkeleton />;
  }

  if (!userId || !planData || !analytics) {
    return (
      <ScreenWrapper>
        <Stack.Screen
          options={{
            headerTitle: "Review",
          }}
        />
        <View className="flex-1 items-center justify-center p-6 mt-20">
          <View className="bg-gray-100 p-6 rounded-full mb-4">
            <Ionicons name="calendar-outline" size={60} color="#94a3b8" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            No Review Found
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            We couldn't find the plan data for this week. It might have been
            deleted or not yet completed.
          </Text>
          <Button onPress={() => router.back()} className="w-full">
            Go Back
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  const weekRange = formatWeekRange(
    planData?.week_start_date,
    planData?.week_end_date
  );
  const keyMetrics = [
    {
      id: 1,
      label: "Total Time",
      value: `${analytics.totalTime} min`,
      icon: "time-outline",
      color: "#10B981",
      bgColor: "bg-emerald-50",
    },
    {
      id: 2,
      label: "Avg/Session",
      value: `${analytics.avgSession} min`,
      icon: "speedometer-outline",
      color: "#3B82F6",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      label: "Longest Streak",
      value: `${analytics.longestStreak}d`,
      icon: "flame-outline",
      color: "#F59E0B",
      bgColor: "bg-amber-50",
    },
    {
      id: 4,
      label: "Best Day",
      value: analytics.bestDay,
      icon: "trophy-outline",
      color: "#8B5CF6",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    <ScreenWrapper>
      <Stack.Screen
        options={{
          headerTitle: "Review",
        }}
      />
      <View className="mb-6 flex-col gap-1">
        <Text className="text-3xl font-bold text-gray-900">Weekly Review</Text>
        <Text className="text-gray-500 text-sm">Overview for {weekRange}</Text>
      </View>

      <View className="flex-row justify-between mb-8">
        <View className="bg-green-100 flex-col items-center justify-center py-4 border border-slate-200 shadow-md rounded-xl w-[32%]">
          <Text className="text-lg font-semibold text-center text-green-900">
            Completed
          </Text>
          <Text className="text-xl font-bold text-center mt-1 text-green-900">
            {analytics.completed}
          </Text>
        </View>

        <View className="bg-yellow-100 flex-col items-center justify-center border border-slate-200 shadow-md rounded-xl w-[32%]">
          <Text className="text-lg font-semibold text-center text-yellow-900">
            Partial
          </Text>
          <Text className="text-xl font-bold text-center mt-2 text-yellow-900">
            {analytics.partial}
          </Text>
        </View>

        <View className="bg-red-100 flex-col items-center justify-center border border-slate-200 shadow-md rounded-xl w-[32%]">
          <Text className="text-lg font-semibold text-center text-red-900">
            Missed
          </Text>
          <Text className="text-xl font-bold text-center mt-2 text-red-900">
            {analytics.missed}
          </Text>
        </View>
      </View>

      <Progress completionRate={analytics.completionRate} />

      <View className="mb-8 flex-col gap-4">
        <Text className="text-bold text-lg">Day-by-Day Status</Text>
        <View className="flex-row items-center gap-2 justify-between">
          {DAYS_OF_WEEK.map((day) => {
            const specficDayData = planData?.weekly_plan_days?.[0];
            return (
              <View key={day}>
                <DayByDay dayData={specficDayData} dayName={day} />
              </View>
            );
          })}
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between gap-3 mb-8">
        {keyMetrics.map((metric) => (
          <View
            key={metric.id}
            className={`min-w-[48%] ${metric.bgColor} rounded-2xl p-4  border border-slate-200 rounded-xl flex-row items-center gap-3`}
          >
            <View className="p-3 rounded-full bg-white/30 items-center justify-center">
              <Ionicons
                name={metric.icon as any}
                size={24}
                color={metric.color}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 font-semibold">
                {metric.label}
              </Text>
              <Text className="text-lg font-bold text-gray-900">
                {metric.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="p-4 border border-green-100 bg-green-100 text-green-900 flex-row gap-2 items-start rounded-lg shadow-md mb-8">
        <Ionicons
          name="bulb-outline"
          size={24}
          color="black"
          className="rounded-full p-1 bg-green-100 text-green-900"
        />
        <View className="">
          <Text className="text-green-900 fon-bold text-xl font-bold mb-2">
            A Tip for the next week
          </Text>
          <Text className="text-sm text-black/80">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nam
            nobis officia pariatur veniam ratione quisquam harum dolores
            consequuntur? Nam.
          </Text>
        </View>
      </View>

      <View className="flex-col gap-2 mb-8">
        <Text className="text-lg text-black/80 font-medium">Note</Text>

        <TextInput
          className="border border-gray-400 rounded-md min-h-24 px-4"
          multiline
          placeholder="Add any notes or reflection"
          value={reflection}
          onChangeText={setReflection}
        />
      </View>

      <Button onPress={() => {}} className="mb-8">
        Save Review
      </Button>
    </ScreenWrapper>
  );
}
