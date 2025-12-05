import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Button } from "@/src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function CreatePlane() {
  const [refelection, setRefelection] = useState("")
  const day = "Octobor 23-29" 


 const weekStatus = [
  {
    day: "Mon",
    status: "completed",
    icon: "checkmark-done-circle-outline" as const,
    color: "#4ade80",
  },
  {
    day: "Tue",
    status: "partial",
    icon: "time-outline" as const,
    color: "#facc15",
  },
  {
    day: "Wed",
    status: "missed",
    icon: "close-circle-outline" as const,
    color: "#f87171",
  },
  {
    day: "Thu",
    status: "completed",
    icon: "checkmark-done-circle-outline" as const,
    color: "#4ade80",
  },
  {
    day: "Fri",
    status: "partial",
    icon: "time-outline" as const,
    color: "#facc15",
  },
  {
    day: "Sat",
    status: "missed",
    icon: "close-circle-outline" as const,
    color: "#f87171",
  },
  {
    day: "Sun",
    status: "completed",
    icon: "checkmark-done-circle-outline" as const,
    color: "#4ade80",
  },
];




 const handleSave = ()=> {
      
 }

  return (
    <ScreenWrapper>
      <View className="mb-8 flex-col gap-2">
       <Text className="text-3xl font-bold ">
         Weakly Review
       </Text>
       <Text className="text-sm ">
         For this week of  {day}
       </Text>
      </View>

     <View className="flex-row justify-between mb-8">
  <View className="bg-green-100 px-2 py-6 border border-slate-200 shadow-md rounded-md w-[32%]">
     <Text className="text-lg font-semibold text-center text-green-900">Completed</Text>
     <Text className="text-xl font-bold text-center mt-2 text-green-900" >4</Text>
  </View>

  <View className="bg-yellow-100 px-4 py-6 border border-slate-200 shadow-md rounded-md w-[32%]">
     <Text className="text-lg font-semibold text-center text-yellow-900">Pending</Text>
     <Text className="text-xl font-bold text-center mt-2 text-yellow-900">2</Text>
  </View>

  <View className="bg-red-100 px-4 py-6 border border-slate-200 shadow-md rounded-md w-[32%]">
     <Text className="text-lg font-semibold text-center text-red-900">Missed</Text>
     <Text className="text-xl font-bold text-center mt-2 text-red-900">1</Text>
  </View>
</View>


      <View className=" p-4 rounded-lg border border-gray-200 flex-col gap-4 mb-8">
      
       <View className="flex-row items-center justify-between gap-2">
          <Text className="text-semibold text-lg">
          This Week's Progress
       </Text>
              <Text>65 %</Text>
       </View>
         <View className={`overflow-hidden rounded-full h-4 bg-gray-400 w-full`} >
         <View className="h-full rounded-full"
          style={{
          width: `${Math.min(100, Math.max(0, 65))}%`,
          backgroundColor: "#276359"
         }}
         >

         </View>
         </View>
     </View>

     <View className="mb-8 flex-col gap-4">
          <Text className="text-bold text-lg">
           Day-by-Day Status 
       </Text>
       <View className="flex-row items-center gap-2 justify-between">

        {
          weekStatus.map((item, index) => (
              <View className="flex-col gap-2 items-center justify-center" key={index}>
         <Text>
            {item.day}
         </Text>
         <Ionicons   color={`${item.color}`} name={item.icon}  size={24} className="rounded-full p-1 bg-white fornt-bold "/>
       </View>
          ))
        }
         
       </View>
       
     </View>

     <View className="p-4 border border-green-100 bg-green-100 text-green-900 flex-row gap-2 items-start rounded-lg shadow-md mb-8">
<Ionicons   name="bulb-outline" size={24} color="black"  className="rounded-full p-1 bg-green-100 text-green-900" />
       <View className="">
        <Text className="text-green-900 fon-bold text-xl font-bold mb-2">
          A Tip for the next week
        </Text>
        <Text className="text-sm text-black/80">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nam nobis officia pariatur veniam ratione quisquam harum dolores consequuntur? Nam.
        </Text>
       </View>
     </View>


         <View className="flex-col gap-2 mb-8"> 
     
          <Text className="text-lg text-black/80 font-medium">
                         Note
                                         </Text> 
     
                   
             <TextInput
             className="border border-gray-400 rounded-md min-h-24 px-4"
             onChangeText={setRefelection}
             value={refelection}
             placeholder="Add Any refelection or comment"
             multiline={true} 
             numberOfLines={5} 
             textAlignVertical="top"
           />
           </View>
     
              <Button
                       className="mt-auto mb-8"
                       onPress={handleSave}
                     >
                      Save Review
                     </Button>

    </ScreenWrapper>
  );
}
