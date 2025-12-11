import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Button } from "@/src/components/ui/Button";
import UpcomingSessionCard from "@/src/components/UpcomingSessionCard";
import { useSession } from "@/src/hooks/useSession";
import { useWeeklyPlan } from "@/src/hooks/useWeeklyPlan";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { format, addDays } from "date-fns";
import { useWeeklyDays } from "@/src/hooks/useWeeklyDays";
import {
  TodaySkeleton,
  UpcomingSkeleton,
  WeeklyMurajaSkeleton,
} from "@/src/components/skeletons";

export default function MurajaIndex() {
  const { user } = useSession();
  const { weeklyPlan, loading, error, refetch } = useWeeklyPlan(
    user?.id ?? null
  );
  const {
    upcomingSessions,
    loading: daysLoading,
    error: daysError,
    todayPlan,
  } = useWeeklyDays(user?.id ?? null, weeklyPlan?.id ?? null);
  const router = useRouter();

  if (loading) {
    return (
      <ScreenWrapper>
        <WeeklyMurajaSkeleton />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center  gap-4">
          <Text className="text-center text-red-500">Error: {error}</Text>
          <Button onPress={() => refetch()}>Retry</Button>
        </View>
      </ScreenWrapper>
    );
  }

  if (!weeklyPlan) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center  gap-4 ">
          <Text className="text-center text-gray-500">
            No weekly plan found. Create one to get started.
          </Text>
          <Button onPress={() => router.push("/create-plan")}>
            Create Plan
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  const startDate = new Date(weeklyPlan.week_start_date);
  const endDate = addDays(startDate, weeklyPlan.total_days - 1);

  const formattedStart = format(startDate, "MMM dd");
  const formattedEnd = format(endDate, "MMM dd");

  return (
    <ScreenWrapper>
      <View className="mb-4 flex-col gap-2">
        <Text className="text-3xl font-bold ">This Week Plan</Text>
        <Text className="text-sm  ml-2">
          For this week of {formattedStart} - {formattedEnd}
        </Text>
      </View>
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-xl border border-gray-200">
        <View className="mb-4">
          <Text className="text-gray-700 text-xs font-medium uppercase">
            Total Pages
          </Text>
          <Text className="text-3xl font-extrabold text-gray-900">
            {weeklyPlan.planned_pages * weeklyPlan.total_days}
          </Text>
        </View>

        <View className="mb-2">
          <Text className="text-gray-700 text-sm">JUZ Range</Text>
          <Text className="text-2xl font-bold text-gray-800">
            {weeklyPlan.start_juz} - {weeklyPlan.end_juz}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-sm">Surah Range</Text>
          <Text className="text-lg font-semibold text-gray-700">
            {weeklyPlan.start_surah} - {weeklyPlan.end_surah}
          </Text>
        </View>

        <View className="flex-row justify-between gap-2 mt-3">
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={18} color="#4B5563" />
            <Text className="text-gray-600 text-sm">
              {weeklyPlan.total_days} days/week
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={18} color="#4B5563" />
            <Text className="text-gray-600 text-sm">
              {weeklyPlan.estimated_time_min} min/day
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="book-outline" size={18} color="#4B5563" />
            <Text className="text-gray-600 text-sm">
              {weeklyPlan.planned_pages} pages/day
            </Text>
          </View>
        </View>
      </View>

      {daysLoading && (
        <>
          <TodaySkeleton />
          <UpcomingSkeleton />
        </>
      )}

      {!daysLoading && todayPlan && (
        <View className="mb-8">
          <Text className="font-bold text-xl mb-4">Today's Muraja'a</Text>

          <View className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xl font-bold text-gray-800">Juz 29</Text>
                <Text className="text-gray-600 text-sm mt-1">20 minutes</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="book-outline" size={24} color="#276359" />
              </View>
            </View>

            <View className="border-t border-gray-300 pt-4">
              <View className="flex-row justify-between gap-2">
                <Pressable className="flex-1 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
                  <Text className="text-center font-semibold text-green-700">
                    Done
                  </Text>
                </Pressable>
                <Pressable className="flex-1 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-xl">
                  <Text className="text-center font-semibold text-yellow-700">
                    Partial
                  </Text>
                </Pressable>
                <Pressable className="flex-1 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                  <Text className="text-center font-semibold text-red-700">
                    Missed
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}

      {!daysLoading && upcomingSessions.length > 0 && (
        <View className="mb-8">
          <Text className="font-bold text-xl mb-4">Upcoming Sessions</Text>

          <View className="flex-col gap-2 ">
            <UpcomingSessionCard
              day="Wednesday"
              juz="Juz 50"
              duration="20 mins"
            />
            <UpcomingSessionCard
              day="Thursday"
              juz="Juz 1"
              duration="20 mins"
            />
          </View>
        </View>
      )}
      {!daysLoading && !todayPlan && upcomingSessions.length === 0 && (
        <Text className="text-gray-400 italic">No plan for This week</Text>
      )}

      <Button
        className="mb-8 mt-auto"
        onPress={() => router.push("/(app)/create-plan")}
      >
        Add New Plan
      </Button>
    </ScreenWrapper>
  );
}
