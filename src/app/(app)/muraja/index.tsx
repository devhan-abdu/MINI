import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Button } from "@/src/components/ui/Button";
import UpcomingSessionCard from "@/src/components/UpcomingSessionCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function MurajaIndex() {
  const router = useRouter()
  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="bg-green-100 rounded-xl p-4 mb-6 shadow-lg border border-green-100">
          <Text className="text-sm ">
            This Week's Muraja'a Plan
          </Text>
          <Text className="text-2xl font-bold mt-1">
            JUZ 28 - 30
          </Text>
          <View className="flex-row items-center gap-6 mt-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text className="text-sm ">5 days/week</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text className="text-sm ">60 min/day</Text>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="font-bold text-xl mb-4">
            Today's Muraja'a
          </Text>
          
          <View className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  Juz 29
                </Text>
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

        
         <Button
                  className="mb-20"
                  onPress={()=> router.push("/(app)/create-plane")}
                >
                  Add New Plan
                </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}