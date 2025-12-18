import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Button } from "@/src/components/ui/Button";
import UpcomingSessionCard from "@/src/components/UpcomingSessionCard";
import { StatusChip } from "@/src/components/ui/StatusChip";
import { useSession } from "@/src/hooks/useSession";
import { useWeeklyPlan } from "@/src/hooks/useWeeklyPlan";
import { useWeeklyDays } from "@/src/hooks/useWeeklyDays";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { format, addDays } from "date-fns";
import { useState } from "react";
import {
  TodaySkeleton,
  UpcomingSkeleton,
  WeeklyMurajaSkeleton,
} from "@/src/components/skeletons";
import { addDailyLog } from "@/src/services";

export default function MurajaIndex() {
  const [status, setStatus] = useState<
    "pending" | "completed" | "partial" | "missed"
  >("pending");
  const { user } = useSession();
  const { weeklyPlan, loading, error, refetch } = useWeeklyPlan(
    user?.id ?? null
  );
  const {
    upcomingSessions,
    loading: daysLoading,
    todayPlan,
  } = useWeeklyDays(user?.id ?? null, weeklyPlan?.id ?? null);
  const router = useRouter();

  const fullDayNames: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

  const handleStatus = async (s: string) => {
    const date = new Date().toISOString().slice(0, 10);
    if (!todayPlan?.id || !user) return;
    try {
      await addDailyLog({
        dayId: todayPlan.id,
        userId: user.id,
        status: s,
        date,
      });
    } catch (error: any) {
      Alert.alert("Error", `Failed to update the status: ${error.message}`);
    }
  };

  if (loading)
    return (
      <ScreenWrapper>
        <WeeklyMurajaSkeleton />
      </ScreenWrapper>
    );
  if (error)
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-red-500">Error: {error}</Text>
          <Button onPress={() => refetch()}>Retry</Button>
        </View>
      </ScreenWrapper>
    );
  if (!weeklyPlan)
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-gray-500">
            No weekly plan found. Create one to get started.
          </Text>
          <Button onPress={() => router.push("/create-plan")}>
            Create Plan
          </Button>
        </View>
      </ScreenWrapper>
    );

  const startDate = new Date(weeklyPlan.week_start_date);
  const endDate = addDays(startDate, weeklyPlan.total_days - 1);
  const formattedStart = format(startDate, "MMM dd");
  const formattedEnd = format(endDate, "MMM dd");

  return (
    <ScreenWrapper>
      <View className="mb-6 flex-col gap-2">
        <Text className="text-3xl font-bold">This Week Plan</Text>
        <Text className="text-sm ml-1 text-gray-600">
          For this week of {formattedStart} - {formattedEnd}
        </Text>
      </View>

      <View className="bg-white rounded-2xl p-6 mb-6 shadow-xl border border-gray-200">
        <View className="mb-5">
          <Text className="text-gray-700 text-xs font-medium uppercase">
            Total Pages
          </Text>
          <Text className="text-3xl font-extrabold text-gray-900">
            {weeklyPlan.planned_pages * weeklyPlan.total_days}
          </Text>
        </View>

        <View className="mb-4">
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

        <View className="flex-row justify-between gap-4 mt-4">
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

      {!daysLoading && todayPlan && (
        <View className="mb-8">
          <Text className="font-bold text-xl mb-4">Today's Muraja'a</Text>
          <View className="bg-white rounded-xl p-5 border border-gray-300 shadow-sm">
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-6 ">
                <View>
                  <Text className="text-xl font-medium text-gray-900">
                    {todayPlan.startSurah === todayPlan.endSurah
                      ? todayPlan.startSurah
                      : `${todayPlan.startSurah} – ${todayPlan.endSurah}`}
                  </Text>
                  <Text className="text-sm uppercase tracking-wide text-gray-700 mt-1">
                    Pages {todayPlan.planned_start_page}–
                    {todayPlan.planned_end_page}
                  </Text>
                </View>
                <Ionicons name="book-outline" size={24} color="#276359" />
              </View>

              <View className="border-t border-gray-300 pt-6 ">
                {status !== "pending" ? (
                  <View className="gap-3">
                    <StatusChip status={status} />
                    <Button
                      className="py-3 mt-2"
                      onPress={() =>
                        router.push(`/muraja/weekly-plane/${todayPlan.id}`)
                      }
                    >
                      Log Today's Muraja'a
                    </Button>
                  </View>
                ) : (
                  <View className="flex-row justify-between gap-3">
                    <Pressable
                      className="flex-1 bg-green-50 border border-green-200 px-3 py-2 rounded-xl"
                      onPress={() => {
                        handleStatus("completed");
                        setStatus("completed");
                      }}
                    >
                      <Text className="text-center font-semibold text-green-700">
                        Done
                      </Text>
                    </Pressable>
                    <Pressable
                      className="flex-1 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-xl"
                      onPress={() => {
                        handleStatus("partial");
                        setStatus("partial");
                      }}
                    >
                      <Text className="text-center font-semibold text-yellow-700">
                        Partial
                      </Text>
                    </Pressable>
                    <Pressable
                      className="flex-1 bg-red-50 border border-red-200 px-3 py-2 rounded-xl"
                      onPress={() => {
                        handleStatus("missed");
                        setStatus("missed");
                      }}
                    >
                      <Text className="text-center font-semibold text-red-700">
                        Missed
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Skeletons */}
      {daysLoading && (
        <>
          <TodaySkeleton />
          <UpcomingSkeleton />
        </>
      )}

      {/* Upcoming Sessions */}
      {!daysLoading && upcomingSessions.length > 0 && (
        <View className="mb-8">
          <Text className="font-bold text-xl mb-4">Upcoming Sessions</Text>
          <View className="flex-col gap-3">
            {upcomingSessions.map((upcoming) => {
              const day = fullDayNames[upcoming.day_of_week];
              return (
                <UpcomingSessionCard
                  key={upcoming.id}
                  day={day}
                  startPage={upcoming.planned_start_page}
                  endPage={upcoming.planned_end_page}
                  duration="20 mins"
                />
              );
            })}
          </View>
        </View>
      )}

      {/* Empty State */}
      {!daysLoading && !todayPlan && upcomingSessions.length === 0 && (
        <Text className="text-gray-400 italic text-center mt-8">
          No plan for this week
        </Text>
      )}

      {/* Add Plan Button */}
      <Button
        className="mb-8 mt-auto"
        onPress={() => router.push("/(app)/create-plan")}
      >
        Add New Plan
      </Button>
    </ScreenWrapper>
  );
}
