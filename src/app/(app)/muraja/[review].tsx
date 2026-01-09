import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { ReviewSkeleton } from "@/src/features/muraja/components/skeletons";
import { useWeeklyReview } from "@/src/features/muraja/hooks/useWeeklyReview";
import { formatWeekRange } from "@/src/features/muraja/utils/dateHelpers";
import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";
import { DayByDay } from "@/src/features/muraja/components/DayByDay";
import { SectionHeader } from "@/src/components/SectionHeader";
import { WeeklyReportCard } from "@/src/features/hifz/components/WeeklyReportCard";


export default function WeeklyReviewPage() {
  const router = useRouter();
  const { review } = useLocalSearchParams<{ review: string }>();
  const { plan, analytics, isLoading, isError, refetch } = useWeeklyReview(
    review ? Number(review) : undefined
  );

  if (isLoading) return <ReviewSkeleton />;

  if (isError) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text className="text-lg font-bold mt-4">Something went wrong</Text>
          <Text className="text-gray-500 text-center mb-6">
            We couldn't load your review data.
          </Text>
          <Button onPress={() => refetch()} className="w-full">
            Try Again
          </Button>
        </View>
      </Screen>
    );
  }
  if (!plan || !analytics) {
    return (
      <Screen>
        <Stack.Screen
          options={{
            headerTitle: "Weekly Review",
            headerShadowVisible: true
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
      </Screen>
    );
  }

  const weekRange = formatWeekRange(plan?.week_start_date, plan?.week_end_date);

  const keyMetrics = useMemo(() => {
  if (!analytics) return [];
  return [
    {
      id: 1,
      label: "Total Time",
      value: `${analytics.totalTime}m`,
      icon: "time-outline",
    },
    {
      id: 2,
      label: "Avg/Session",
      value: `${analytics.avgSession}m`,
      icon: "speedometer-outline",
    },
    {
      id: 3,
      label: "Best Streak",
      value: `${analytics.longestStreak}d`,
      icon: "flame-outline",
    },
    {
      id: 4,
      label: "Peak Day",
      value: analytics.bestDay,
      icon: "trophy-outline",
    },
  ];
}, [analytics]);

 return (
   <>
     <Stack.Screen
       options={{ headerTitle: "Weekly Review", headerShadowVisible: true }}
     />
     <Screen>
       <ScreenContent>
         <WeeklyReportCard rate={ analytics.completionRate} completed={analytics.completed} partial={analytics.partial} missed={analytics.missed} weekRange={weekRange} />

         <View className="mb-8">
           <SectionHeader title="Daily Tracker" />
           <DayByDay days={plan.weekly_plan_days ?? []} />
         </View>

         <View className="flex-row flex-wrap justify-between gap-3 mb-8">
           {keyMetrics.map((metric) => (
             <View
               key={metric.id}
               className="w-[48%] bg-white rounded-3xl p-4 border border-gray-100 flex-row items-center gap-3"
             >
               <View className="p-2 rounded-xl bg-gray-50">
                 <Ionicons
                   name={metric.icon as any}
                   size={20}
                   color="#276359"
                 />
               </View>
               <View>
                 <Text className="text-gray-500 font-bold text-sm uppercase tracking-tighter">
                   {metric.label}
                 </Text>
                 <Text className="text-sm font-black text-gray-900">
                   {metric.value}
                 </Text>
               </View>
             </View>
           ))}
         </View>

         <View className="bg-gray-50 rounded-[24px] p-5 border border-gray-100 flex-row gap-4 items-start mb-10">
           <View className="bg-white p-2 rounded-lg shadow-sm">
             <Ionicons name="bulb" size={20} color="#EAB308" />
           </View>
           <View className="flex-1">
             <Text className="text-gray-900 font-black text-sm mb-1">
               Growth Tip
             </Text>
             <Text className="text-gray-500 text-xs leading-5">
               Consistency is better than intensity. If you are struggling with
               a specific Juz, try reducing the daily page target for next week
               to build confidence.
             </Text>
           </View>
         </View>
       </ScreenContent>
     </Screen>
   </>
 );
}
