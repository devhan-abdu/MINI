import ScreenWrapper from "@/src/components/ScreenWrapper";
import WeeklyPlanCard from "@/src/components/WeeklyPlaneCard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";


  const mockWeekData = [
  {
    id: "1",
    day: "Monday",
    date: "Dec 16",
    status: "Completed" as const,
    juz: "Juz 3-4",
    pages: 20,
    minutes: 45,
  },
  {
    id: "2",
    day: "Tuesday",
    date: "Dec 17",
    status: "Partial" as const,
    juz: "Juz 5",
    pages: 25,
    minutes: 60,
  },
  {
    id: "3",
    day: "Wednesday",
    date: "Dec 18",
    status: "Pending" as const,
    juz: "Juz 6",
    pages: 22,
    minutes: 50,
  },
  {
    id: "4",
    day: "Thursday",
    date: "Dec 19",
    status: "Pending" as const,
    juz: "Juz 7",
    pages: 18,
    minutes: 40,
  },
  {
    id: "5",
    day: "Friday",
    date: "Dec 20",
    status: "Missed" as const,
    juz: "Juz 8",
    pages: 20,
    minutes: 45,
  },
  {
    id: "6",
    day: "Saturday",
    date: "Dec 21",
    status: "Pending" as const,
    juz: "Juz 9",
    pages: 30,
    minutes: 75,
  },
];

export default function CreatePlane() {

    const router = useRouter()
    const [plans, setPlans] = useState(mockWeekData);
    



  const handleCardPress = (id: string) => {
    console.log("Card pressed:", id);
    // Navigate to log page or show modal
  };

  const handleLogMuraja = (id: string) => {
    console.log("Log Muraja'a for:", id);
    // Update status to "Completed" or "Partial"
    setPlans(prev =>
      prev.map(plan =>
        plan.id === id
          ? { ...plan, status: "Completed" }
          : plan
      )
    );
  };

  return (
   <ScreenWrapper>
     <View className="bg-white p-4 rounded-lg border border-gray-200 flex-col gap-4 mb-12">
       <Text className="text-semibold text-lg">
          This Week's Progress
       </Text>
         <View className={`overflow-hidden rounded-full h-4 bg-gray-400 w-full`} >
         <View className="h-full rounded-full"
          style={{
          width: `${Math.min(100, Math.max(0, 65))}%`,
          backgroundColor: "#276359"
         }}
         >

         </View>
         </View>
       <Text>{2} of {3} Completed</Text>
     </View>
   {mockWeekData.map((plan) => (
        <WeeklyPlanCard
          key={plan.id}
          day={`${plan.day} • ${plan.date}`}
          status={plan.status}
          juz={plan.juz}
          pages={plan.pages}
          minutes={plan.minutes}
          onPress={() => 
            router.push(`/muraja/weekly-plane/${plan.id}`)
            // plan.status === "Completed" 
            //   ? handleCardPress(plan.id)
            //   : handleLogMuraja(plan.id)

          }
        />
      ))}
    
   </ScreenWrapper>
  );
}
