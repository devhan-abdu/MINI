import { IHifzPlan } from "@/src/features/hifz/types";
import { hifzStatus } from "@/src/features/hifz/utils/plan-status";
import {  ISurah } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useMemo } from "react";
import { View, Text } from "react-native";

// manage how to hifz adn muraja not exit
type Cardprops = {
    hifzPlan: IHifzPlan | null;
    murajaPlan: any;
    surah: ISurah[];
}

export default function Card({
    hifzPlan,
    murajaPlan,
    surah
}: Cardprops) {

  if(!hifzPlan || !murajaPlan){
    return null;
  }
    const hifzAnalytics = useMemo(
        () => hifzStatus(hifzPlan ?? null, surah),
        [hifzPlan, surah]
     );
    
    if(!hifzAnalytics){
        return null;
    }
      const dateRange = `${format(
        new Date(murajaPlan.week_start_date),
        "MMM dd"
      )} - ${format(new Date(murajaPlan.week_end_date), "MMM dd")}`;
    
    return (
      <View className="bg-primary rounded-[32px] p-8 shadow-2xl shadow-primary/30 overflow-hidden">
        <View className="flex-row justify-between items-center mb-10">
          <View className="">
            <Text className="text-white/50 font-bold uppercase tracking-[3px] text-[10px] mb-1">
              Active Progress
            </Text>
            <View className="flex-row items-center">
              <Text className="text-white text-4xl font-black font-rosemary tracking-tighter">
                Core Journey
              </Text>
            </View>
          </View>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color="rgba(255,255,255,0.5)"
          />
        </View>

        <View className="flex-row">
          <View className="flex-1 pr-6 border-r border-white/10">
            <View className="flex-row items-center mb-3">
              <View className="p-1.5 bg-white/10 rounded-lg mr-2">
                <Ionicons name="book-outline" size={14} color="white" />
              </View>
              <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                Hifz Journey
              </Text>
            </View>

            <Text className="text-white text-2xl font-black tracking-tighter mb-1">
              Surah {hifzAnalytics.endSurah}
            </Text>
                    <Text className="text-white/80 font-bold text-xs">Page {hifzAnalytics.startPage} - {hifzAnalytics.endPage}</Text>
            <View className="mt-6 flex-row justify-between">
              <View>
                <Text className="text-white/40 text-[8px] font-black uppercase mb-1">
                  Target End
                </Text>
                <Text className="text-white font-bold text-sm mb-1">
                  {hifzAnalytics.targetEndDate}
                </Text>
              </View>
              <View>
                <Text className="text-white/40 text-[8px] font-black uppercase ">
                  Daily Pages
                </Text>
                <Text className="text-white font-bold text-sm mb-1">
                  {hifzAnalytics.todayTarget}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-1 pl-6">
            <View className="flex-row items-center mb-3">
              <View className="p-1.5 bg-white/10 rounded-lg mr-2">
                <Ionicons name="repeat-outline" size={14} color="white" />
              </View>
              <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                Weekly Muraja
              </Text>
            </View>

            <Text className="text-white text-2xl font-black tracking-tighter mb-1">
              Juz {murajaPlan.start_juz}—{murajaPlan.end_juz}
            </Text>
            <Text className="text-white/80 font-bold text-xs">
              {dateRange}
            </Text>

            <View className="mt-6 flex-row justify-between">
              <View>
                <Text className="text-white/40 text-[8px] font-black uppercase mb-1">
                  Daily
                </Text>
                <Text className="text-white font-bold text-xs">
                  {murajaPlan.planned_pages} pgs
                </Text>
              </View>
              <View>
                <Text className="text-white/40 text-[8px] font-black uppercase mb-1">
                  Time
                </Text>
                <Text className="text-white font-bold text-xs">
                  {murajaPlan.estimated_time_min}m
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
}