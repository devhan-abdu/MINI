import { IHifzPlan } from "@/src/features/hifz/types";
import { hifzStatus } from "@/src/features/hifz/utils/plan-status";
import { ISurah } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useMemo } from "react";
import { Text } from "@/src/components/common/ui/Text";
import { View } from "react-native";

type Cardprops = {
  hifzAnalytics: any;
  murajaPlan: any;
  surah: ISurah[];
};

export default function Card({ hifzAnalytics, murajaPlan, surah }: Cardprops) {
  if (!murajaPlan) return null;

  if (!hifzAnalytics) return null;

  const dateRange = `${format(new Date(murajaPlan.week_start_date), "MMM dd")} - ${format(new Date(murajaPlan.week_end_date), "MMM dd")}`;

  return (
    <View className="bg-primary rounded-[40px] p-7 shadow-2xl shadow-primary/40 overflow-hidden relative">
      <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />

      <View className="flex-row justify-between items-end mb-6">
        <View>
          <Text className="text-white/60  uppercase tracking-[2px] text-[10px] mb-1">
            {format(new Date(), "EEEE, MMM dd")}
          </Text>
          <Text className="text-white text-3xl  tracking-tighter">
            Hifz <Text className="text-white/50">&</Text> Muraja
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-white/60  uppercase text-[8px] mb-1 tracking-widest">
            Hifz Progress
          </Text>
          <View className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <Text className="text-white  text-[11px]">
              {hifzAnalytics.progress}%
            </Text>
          </View>
        </View>
      </View>

      <View className="w-full h-[7px] bg-white/10 rounded-full mb-9 overflow-hidden">
        <View
          style={{ width: `${hifzAnalytics.progress}%` }}
          className="h-full bg-white rounded-full shadow-sm shadow-white"
        />
      </View>

      <View className="flex-row">
        <View className="flex-1 pr-5 border-r border-white/10">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="book-outline"
              size={13}
              color="rgba(255,255,255,0.7)"
            />
            <Text className="text-white/50 text-[9px]  uppercase tracking-widest ml-2">
              Current Hifz
            </Text>
          </View>

          <Text
            className="text-white text-2xl  tracking-tight leading-7"
            numberOfLines={1}
          >
            {hifzAnalytics.currentSurah}
          </Text>
          <Text className="text-white/80   text-[11px] mt-1">
            Page {hifzAnalytics.currentPage}
            <Text className="text-white/40"> of {hifzAnalytics.endPage}</Text>
          </Text>

          <View className="mt-7 flex-row justify-between items-center">
            <View>
              <Text className="text-white/40 text-[8px]  uppercase mb-0.5">
                Target End
              </Text>
              <Text className="text-white   text-[11px]">
                {hifzAnalytics.targetEndDate}
              </Text>
            </View>
            <View className="h-6 w-[1px] bg-white/5" />
            <View>
              <Text className="text-white/40 text-[8px]  uppercase mb-0.5">
                Rate
              </Text>
              <Text className="text-white   text-[11px]">
                {hifzAnalytics.todayTarget} p/d
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 pl-5">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="repeat-outline"
              size={15}
              color="rgba(255,255,255,0.7)"
            />
            <Text className="text-white/50 text-[9px]  uppercase tracking-widest ml-2">
              Weekly Muraja
            </Text>
          </View>

          <Text className="text-white text-2xl  tracking-tight leading-7">
            Juz {murajaPlan.start_juz}—{murajaPlan.end_juz}
          </Text>
          <Text className="text-white/70   text-[10px] mt-1 italic italic">
            {dateRange}
          </Text>

          <View className="mt-7 flex-row justify-between items-center">
            <View>
              <Text className="text-white/40 text-[8px]  uppercase mb-0.5">
                Daily Goal
              </Text>
              <Text className="text-white   text-[11px]">
                {murajaPlan.planned_pages} pgs
              </Text>
            </View>
            <View className="h-6 w-[1px] bg-white/5" />
            <View>
              <Text className="text-white/40 text-[8px]  uppercase mb-0.5">
                Est. Time
              </Text>
              <Text className="text-white   text-[11px]">
                {murajaPlan.estimated_time_min}m
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
