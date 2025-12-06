import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

export default function CreateWeeklyPlan() {
  const router = useRouter();

  const [weekStart, setWeekStart] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [numberOfPage, setNumberOfPage] = useState("");
  const [pageFrom, setPageFrom] = useState("");
  const [surah, setSurah] = useState("");
  const [estTime, setEstTime] = useState("");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  }

  function handleDateSelect(e: any, selectedDate?: Date) {
    setShowDatePicker(false);
    if (selectedDate) {
      setWeekStart(selectedDate);
    }
  }

  function handleSubmit() {
    console.log({
      weekStart,
      selectedDays,
      numberOfPage,
      pageFrom,
      surah,
      estTime,
    });
    router.back();
  }

  const formattedWeekStart = weekStart
    ? weekStart.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    : "";

  return (
    <ScreenWrapper >
      <Stack.Screen
        options={{
          title: "Create Weekly Plan",
          headerShown: true,
          headerShadowVisible: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#111827',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />

  
        <View className=" pb-8 ">


          <View className="mb-8">
            <View className="mb-1">
              <Text className="text-lg font-medium  mb-2">
                Week Start Date
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white flex-row items-center justify-between active:bg-gray-50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-primary-50 items-center justify-center">
                    <Ionicons name="calendar-outline" size={20} color="#276359" />
                  </View>
                  <View>
                    <Text className={`text-base ${formattedWeekStart ? 'text-gray-900' : 'text-gray-400'}`}>
                      {formattedWeekStart || "Select date"}
                    </Text>
                    <Text className="text-sm text-gray-500">Choose when to start</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            {showDatePicker && (
              <View className="mt-2 bg-white rounded-xl border border-gray-200 p-4">
                <Text className="font-medium text-lg text-black mb-3">Select Date</Text>
                <DateTimePicker
                  value={weekStart || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateSelect}
                  themeVariant="light"
                />
              </View>
            )}
          </View>

          <View className="mb-8">
            <Text className="text-lg font-medium  mb-3">
              Select Days
            </Text>
            <Text className="text-gray-500 text-sm mb-4">
              Choose which days you want Muraja'a
            </Text>
            
            <View className="flex-row flex-wrap gap-x-2 gap-y-2">
              {days.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(day)}
                    className={`
                      flex-1 min-w-[72px] h-12 rounded-sm border bg-white
                      ${isSelected 
                        ? 'border-green-100 bg-green-100 ' 
                        : 'border-gray-200'
                      }
                      items-center justify-center
                      active:opacity-90
                    `}
                    style={{ 
                      shadowColor: isSelected ? '#276359' : '#000',
                      shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
                      shadowOpacity: isSelected ? 0.1 : 0,
                      shadowRadius: isSelected ? 4 : 0,
                      elevation: isSelected ? 3 : 0,
                    }}
                  >
                    <Text className={`
                      font-semibold text-base
                      ${isSelected ? 'text-primary' : 'text-gray-700'}
                    `}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            
            <View className="mt-4 flex-row items-center">
              <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">
                {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-medium  mb-3">
              Daily Reading Goal
            </Text>
            
            <View className="space-y-4">
              <Input
                label="Number of Pages"
                placeholder="e.g. 25"
                value={numberOfPage}
                setValue={setNumberOfPage}
                keyboardType="numeric"
                leftIcon={<Ionicons name="document-text-outline" size={20} color="#6B7280" />}
                containerClassName="mb-2"
              />
              
              <Input
                label="Start From Page"
                placeholder="e.g. 12"
                value={pageFrom}
                setValue={setPageFrom}
                keyboardType="numeric"
                leftIcon={<Ionicons name="arrow-forward-outline" size={20} color="#6B7280" />}
                containerClassName="mb-2"
              />
              
              <Input
                label="Surah Name"
                placeholder="e.g. Al-Baqarah"
                value={surah}
                setValue={setSurah}
                leftIcon={<Ionicons name="book-outline" size={20} color="#6B7280" />}
                containerClassName="mb-2"
              />
              
              <Input
                label="Estimated Time (minutes)"
                placeholder="e.g. 30"
                value={estTime}
                setValue={setEstTime}
                keyboardType="numeric"
                leftIcon={<Ionicons name="time-outline" size={20} color="#6B7280" />}
                rightIcon={<Text className="text-gray-500">min/day</Text>}
                containerClassName="mb-2"
              />
            </View>
          </View>

          <View className="mt-8 pt-6 border-t border-gray-200">
            <View className="flex-row gap-3 mb-4">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => router.back()}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </Button>
              
              <Button
                className="flex-1"
                onPress={handleSubmit}
                disabled={!weekStart || selectedDays.length === 0}
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text className="text-white font-semibold text-base">
                    Create Plan
                  </Text>
                </View>
              </Button>
            </View>
            
            <View className="flex-row items-center justify-center mt-4">
              <Ionicons name="checkmark-circle-outline" size={16} color="#276359" />
              <Text className="text-primary-700 text-sm ml-2">
                Plan will be added to your weekly schedule
              </Text>
            </View>
          </View>
        </View>
    </ScreenWrapper>
  );
}