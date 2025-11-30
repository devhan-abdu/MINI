
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
      numberOfPage ,
     pageFrom,
      surah,
      estTime,
    });

    router.back();
  }

  const formattedWeekStart = weekStart
    ? weekStart.toDateString()
    : "";

  return (
    <ScreenWrapper>
      <Stack.Screen
        options={{
          title: "Create Weekly Plan",
          headerShown: true,
        }}
      />

      <View className="mt-0 mb-12"> 

            <View>
        <Input
            label="Week Start"
            placeholder="Choose a date"
            value={formattedWeekStart}
            setValue={() => {}}
            editable={false}
            rightIcon={<Ionicons name="calendar-outline" size={24} color="#000" />}
            onRightIconPress={() => setShowDatePicker(true)}
        />

        {showDatePicker && (
            <DateTimePicker
            value={weekStart || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateSelect}
            />
        )}
        </View>

        <Text className="text-xl font-semibold mt-6 mb-2 text-black">
          Select Days
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-6">
           {
             days.map((day) => {
                 const active = selectedDays.includes(day)
                  return (
                      <Pressable key={day} onPress={() => toggleDay(day)}
                       className={`px-4 py-1.5 rounded-full border ${active ? "bg-black border-black": "border-gray-400"}`}
                      >

                        <Text
                        className={`font-medium ${
                            active ? "text-white" : "text-black"
                        }`}
                        >
                          {day}   
                        </Text>
                         
                      </Pressable>
                  )
             })
           }
        </View>

        <Input
          label="Daily Target page"
          placeholder="e.g. 25"
          value={numberOfPage}
          setValue={setNumberOfPage}
        />

         <Input
          label="Start Surah"
          placeholder="Al-Baqarah"
          value={surah}
          setValue={setSurah}
        />
        <Input
          label="Start Page number"
          placeholder="e.g. 12"
          value={pageFrom}
          setValue={setPageFrom}
        />


        <Input
          label="Est. Time (mins)"
          placeholder="e.g. 30"
          value={estTime}
          setValue={setEstTime}
        />

        <Button
          className="mt-8"
          onPress={handleSubmit}
        >
          Add Weekly Plan
        </Button>
      </View>
    </ScreenWrapper>
  );
}
