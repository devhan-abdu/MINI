import ScreenWrapper from "@/src/components/ScreenWrapper";
import UpcomingSessionCard from "@/src/components/UpcomingSessionCard";
import { Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type StatusType = "completed" | "partial" | "missed";

type HistoryItem = {
   date: string,
   status: StatusType,
}


export default function CreatePlane() {

const STATUS_COLORS: Record<StatusType, {bg: string , text: string}> = {
  completed: {
    bg: "#c8f8d9ff",  
    text: "#064e3b" 
  },
  partial: {
    bg: "#faf3a8ff",  
    text: "#854d0e" 
  },
  missed: {
    bg: "#fdceceff", 
    text: "#7f1d1d" 
  }
}

const userHistory: HistoryItem[] = [
   { date: "2025-12-03", status: "completed" },
   { date: "2025-12-04", status: "completed" },
   { date: "2025-12-05", status: "completed" },
   { date: "2025-12-013", status: "missed" },
   { date: "2025-12-037", status: "partial" },
   { date: "2025-12-08", status: "missed" },
   { date: "2025-12-09", status: "partial" },
   { date: "2025-12-010", status: "completed" },
    { date: "2025-12-011", status: "partial" },
    { date: "2025-12-012", status: "missed" }
]

const today = new Date().toISOString().split("T")[0];

const markedDates: Record< string, any> =   {
  [today]: {
     customStyles: {
      container: {
        backgroundColor: "#00ADF6",
    
      },
      text: {
         color:"#fff",
      }
    }
  }
};

userHistory.forEach((item) =>{
   markedDates[item.date] = {
    customStyles: {
      container: {
        backgroundColor: STATUS_COLORS[item.status].bg,
        width:28,
        height: 28
      },
      text: {
         color:STATUS_COLORS[item.status].text,
         fontSize: 16,
      }
    }
   }
})

  return (
    <ScreenWrapper>

  <View className="border border-slate-300 rounded-xl shadow-xl bg-white shadow-white mb-8">


    <View className="p-2">
      <Calendar markingType="custom" markedDates={markedDates}/>
    </View>
    <View className="flex-row items-center justify-center gap-6 border-t border-slate-200 py-5">
        <View className="flex-row items-center gap-2">
          <Text className="bg-green-400 rounded-full w-3 h-3"/>
               
          <Text className="text-sm text-black/80">
           Completed
          </Text>

        </View>

         <View className="flex-row items-center gap-2">
          <Text className="bg-yellow-400 rounded-full w-3 h-3"/>
               
          <Text className="text-sm text-black/80">
           Partial
          </Text>

        </View>

         <View className="flex-row items-center gap-2">
          <Text className="bg-red-400 rounded-full w-3 h-3"/>
               
          <Text className="text-sm text-black/80">
           Missed
          </Text>

        </View>
    </View>

      </View>

      <View className="flex-row gap-2 items-center justify-between mb-8">
          <View className="flex-col items-center justify-center gap-1 border border-slate-200 rounded-xl min-w-[48%] px-2 py-4 shadow-xl shadow-white">
             <Text className="text-sm text-black/90">
               Last 4 Weeks
             </Text>
             <Text className="text-2xl text-primary font-bold">
                75%
             </Text>
             <Text className="text-sm text-black/90">
                Completion Rate
             </Text>
          </View>
           <View className="flex-col items-center justify-center gap-1 border border-slate-200 rounded-xl min-w-[48%] px-2 py-4 shadow-xl shadow-white">
             <Text className="text-sm text-black/90">
               Longest Streak
             </Text>
             <Text className="text-2xl text-primary font-bold">
                12 Days
             </Text>
             <Text className="text-sm text-black/90">
                keep it up
             </Text>
          </View>
      </View>

      <View className="mb-8">
        <Text className="text-xl font-semibold capitalize mb-4">
           previous Weekly Reviews
        </Text>

        <View className="flex-col gap-3">
         <UpcomingSessionCard  day ="Oct 16 - Oct 22" success="85% Completion" /> 
         <UpcomingSessionCard  day ="Oct 9 - Oct 15" success="70% Completion" /> 
         <UpcomingSessionCard  day ="Oct 2 - Oct 8" success="100% Completion" /> 

        </View>
      </View>
      </ScreenWrapper>
  );
}
