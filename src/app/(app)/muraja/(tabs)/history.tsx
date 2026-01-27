import React, { useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";
import { HistoryCalendar } from "@/src/features/muraja/components/HistoryCalendar";
import WeeklyReviewCard from "@/src/features/muraja/components/WeeklyReviewCard";
import { useHistory } from "@/src/features/muraja/hooks/useHistory";
import { SectionHeader } from "@/src/components/SectionHeader";


const StatCard = ({
  label,
  value,
  sub,
  icon,
  color = "text-primary",
}: {
  label: string;
  value: string;
  sub: string;
  icon: any;
  color?: string;
}) => (
  <View className="bg-white border border-slate-100 rounded-[28px] p-4 shadow-sm w-[48%] mb-1">
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-[9px] uppercase tracking-[2px] text-gray-400 font-black">
        {label}
      </Text>
      <View className="bg-gray-50 p-1.5 rounded-lg">
        <Ionicons name={icon} size={12} color="#94a3b8" />
      </View>
    </View>
    <Text className={`text-2xl font-black tracking-tight ${color}`}>
      {value}
    </Text>
    <Text className="text-[10px] text-gray-400 font-medium mt-1">{sub}</Text>
  </View>
);



export default function History() {
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;

  const { userHistory, weekHistory, isLoading, analytics } = useHistory(
    year,
    month
  );

  const hasData =
    analytics && (analytics.totalPages > 0 || analytics.longestStreak > 0);

  return (
    <Screen>
      <ScreenContent>
        <SectionHeader title="History" />
        <HistoryCalendar userHistory={userHistory} setViewDate={setViewDate} />
        {hasData && (
          <View className="mb-8">
            <SectionHeader title="Monthly Insights" />

            <View className="flex-row flex-wrap justify-between gap-y-3">
              <StatCard
                label="Completion"
                value={`${analytics.completionRate}%`}
                sub="Monthly Success"
                icon="pie-chart-outline"
              />
              <StatCard
                label="Pages"
                value={`${analytics.totalPages}`}
                sub="Total Reviewed"
                icon="book-outline"
              />
              <StatCard
                label="Streak"
                value={`${analytics.longestStreak}d`}
                sub="Current Flow"
                icon="flame"
                color={
                  analytics.longestStreak > 0
                    ? "text-orange-500"
                    : "text-gray-400"
                }
              />
              <StatCard
                label="Time"
                value={`${analytics.totalMinutes}m`}
                sub="Total Effort"
                icon="time-outline"
              />
            </View>
          </View>
        )}
        <View className="mb-10">
          <SectionHeader
            title="Weekly Reviews"
            badge={`${weekHistory?.length || 0} Sessions`}
          />

          {isLoading ? (
            <View className="py-20 items-center">
              <Text className="text-gray-400 font-medium italic">
                Loading history...
              </Text>
            </View>
          ) : weekHistory?.length > 0 ? (
            <WeeklyReviewCard weekHistory={weekHistory} />
          ) : (
            <View className="p-12 bg-gray-50 rounded-[40px] border border-dashed border-gray-200 items-center">
              <View className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Ionicons name="file-tray-outline" size={32} color="#cbd5e1" />
              </View>
              <Text className="text-center text-gray-900 font-bold text-lg">
                No history found
              </Text>
              <Text className="text-center text-gray-400 text-sm mt-1 px-6">
                Complete your weekly plans to see your progress reports here.
              </Text>
            </View>
          )}
        </View>
      </ScreenContent>
    </Screen>
  );
}
