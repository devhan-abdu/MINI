import ScreenWrapper from "@/src/components/ScreenWrapper";
import { HistoryCalendar } from "@/src/features/muraja/components/HistoryCalendar";
import WeeklyReviewCard from "@/src/features/muraja/components/WeeklyReviewCard";
import { useHistory } from "@/src/features/muraja/hooks/useHistory";
import { useState } from "react";
import { Text, View } from "react-native";

export default function History() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  const { userHistory, weekHistory, isLoading, isError, refetch } = useHistory(
    year,
    month
  );

  return (
    <ScreenWrapper>
      <HistoryCalendar userHistory={userHistory} setViewDate={setViewDate} />

      <View className="flex-row gap-3 mb-8">
        <StatCard label="Last 4 Weeks" value="75%" sub="Completion Rate" />
        <StatCard label="Longest Streak" value="12 Days" sub="keep it up" />
      </View>

      <View className="mb-8">
        <Text className="text-xl font-semibold capitalize mb-4">
          previous Weekly Reviews
        </Text>

        {isLoading ? (
          <Text>Loading reviews...</Text>
        ) : weekHistory?.length > 0 ? (
          <WeeklyReviewCard weekHistory={weekHistory} />
        ) : (
          <View className="p-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Text className="text-center text-gray-400">
              No reviews for this month
            </Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const StatCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) => {
  return (
    <View className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <Text className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
        {label}
      </Text>
      <Text className="text-2xl text-primary font-black">{value}</Text>
      <Text className="text-[11px] text-gray-400 mt-1">{sub}</Text>
    </View>
  );
};
