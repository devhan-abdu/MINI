import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "@/src/components/ui/Input";
import SurahDropdown, {
   SurahPageDropdown,
} from "@/src/features/muraja/components/SurahDropdown";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IWeeklyMurajaDayInsert,
  WeeklyMurajaFormType,
  WeeklyMurajaSchema,
} from "@/src/types";
import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { useSession } from "@/src/hooks/useSession";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { useCreatePlan } from "@/src/features/muraja/hooks/useCreatePlan";
import { getPlannedDates } from "@/src/features/muraja/utils/dateHelpers";
import { getWeeklyPlanData } from "@/src/features/muraja/utils/quranMapping";


const dayObjects = [
  { name: "Mon", offset: 0 },
  { name: "Tue", offset: 1 },
  { name: "Wed", offset: 2 },
  { name: "Thu", offset: 3 },
  { name: "Fri", offset: 4 },
  { name: "Sat", offset: 5 },
  { name: "Sun", offset: 6 },
];

export default function CreateWeeklyPlan() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useSession();
  const { items } = useLoadSurahData();
  const { createPlan, isCreating, error } = useCreatePlan();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(WeeklyMurajaSchema),
    defaultValues: {
      week_start_date: "",
      planned_pages: 20,
      start_surah: 1,
      start_page: 1,
      estimated_time_min: 20,
      selectedDays: [],
      place: "",
      note: "",
    },
  });

  const selectedSurah = useWatch({
    control,
    name: "start_surah",
  });
  const weekStart = useWatch({ control, name: "week_start_date" });

  const onSubmit = async (data: WeeklyMurajaFormType) => {
   if (!user?.id) return;
   
    try {
      const { selectedDays, ...rest } = data;

      const calculatedDays = getPlannedDates(
        weekStart,
        selectedDays as number[],
        rest.planned_pages,
        rest.start_page
      );

      const endDate = calculatedDays[calculatedDays.length - 1].date;

      const quranData =
        getWeeklyPlanData(
          rest.start_page,
          rest.planned_pages,
          selectedDays.length,
          items
        );
      
      if (!quranData.startSurah || !quranData.endSurah) {
        Alert.alert(
          "Error",
          "Could not calculate Quranic range. Please check your inputs."
        );
        return;
      }

      const planPayload ={
        ...rest,
        user_id: user!.id,
        end_surah: quranData.endSurah,
        start_surah: quranData.startSurah,
        end_page:quranData.endPage,
        start_juz: quranData.startJuz!,
        end_juz: quranData.endJuz!,
        total_days: selectedDays.length,
        week_end_date: endDate,
        status: "pending"
      };


      const daysPayload: IWeeklyMurajaDayInsert[] = calculatedDays.map((day) => ({
        day_of_week: day.day_of_week,
        date: day.date,
        planned_start_page: day.planned_start_page!,
        planned_end_page: day.planned_end_page!,
        planned_pages: rest.planned_pages!,
        estimated_time_min: rest.estimated_time_min!,
      }));
      
     await createPlan({planData: planPayload, days: daysPayload});


      Alert.alert("Success", "Weekly plan created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", `Failed to create weekly plan ${error.message} `);
    }
  };

  const formattedWeekStart = weekStart
    ? new Date(weekStart).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Weekly Plan",
          headerShown: true,
          headerShadowVisible: true,
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#111827",
          headerTitleStyle: { fontWeight: "600" },
        }}
      />
      <ScreenWrapper>
        <View className="mb-8">
          <Text className="text-lg font-medium mb-2">Week Start Date</Text>

          <Controller
            control={control}
            name="week_start_date"
            render={({ field: { value, onChange } }) => (
              <>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white flex-row items-center justify-between active:bg-gray-50"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-lg bg-primary-50 items-center justify-center">
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#276359"
                      />
                    </View>
                    <View>
                      <Text
                        className={`text-base ${
                          formattedWeekStart ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {formattedWeekStart || "Select date"}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Choose when to start
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    onChange={(e, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate)
                        onChange(selectedDate.toISOString().slice(0, 10));
                    }}
                  />
                )}
              </>
            )}
          />
        </View>

        <View className="mb-8">
          <Text className="text-lg font-medium mb-3">Select Days</Text>
          <Text className="text-gray-500 text-sm mb-4">
            Choose which days you want Muraja'a
          </Text>
          <Controller
            name="selectedDays"
            control={control}
            render={({ field: { value, onChange } }) => (
              <View className="flex-row flex-wrap gap-x-2 gap-y-2">
                {dayObjects.map((day) => {
                  const isSelected = value.includes(day.offset);

                  const handlePress = () => {
                    if (isSelected) {
                      onChange(value.filter((v) => v !== day.offset));
                    } else {
                      onChange([...value, day.offset]);
                    }
                  };
                  return (
                    <Pressable
                      key={day.offset}
                      onPress={handlePress}
                      className={`
                      flex-1 min-w-[64px] h-10 rounded-full border bg-white
                      ${
                        isSelected
                          ? "border-green-100 bg-green-400 text-green-900"
                          : "border-gray-200 bg-white text-black"
                      }
                      items-center justify-center
                      active:opacity-90
                    `}
                      style={{
                        shadowColor: isSelected ? "#276359" : "#000",
                        shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
                        shadowOpacity: isSelected ? 0.1 : 0,
                        shadowRadius: isSelected ? 4 : 0,
                        elevation: isSelected ? 3 : 0,
                      }}
                    >
                      <Text
                        className={`font-semibold text-base ${
                          isSelected ? "text-primary" : "text-gray-700"
                        }`}
                      >
                        {day.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </View>

        <View className="mb-6">
          <View className="">
            <Controller
              control={control}
              name="planned_pages"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Daily Reading Goal (in Page)"
                  placeholder="number of page "
                  value={String(value)}
                  setValue={(v) => onChange(Number(v))}
                  keyboardType="numeric"
                  containerClassName="mb-2"
                />
              )}
            />
            {errors.planned_pages && (
              <Text className="text-red-500">
                {errors.planned_pages.message}
              </Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="start_surah"
              render={({ field: { value, onChange } }) => (
                <SurahDropdown surah={value} setSurah={onChange} />
              )}
            />

            {errors.start_surah && (
              <Text className="text-red-500">{errors.start_surah.message}</Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="start_page"
              render={({ field: { value, onChange } }) => (
                <SurahPageDropdown
                  surah={selectedSurah}
                  setPage={onChange}
                  page={value}
                />
              )}
            />

            {errors.start_page && (
              <Text className="text-red-500">{errors.start_page.message}</Text>
            )}
          </View>

          <Controller
            control={control}
            name="estimated_time_min"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Estimated Time (minutes)"
                placeholder="e.g. 30"
                value={String(value)}
                setValue={(v) => onChange(Number(v))}
                keyboardType="numeric"
                leftIcon={
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                }
                rightIcon={<Text className="text-gray-500">min/day</Text>}
                containerClassName="mb-2"
              />
            )}
          />
          <Controller
            control={control}
            name="place"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Place"
                placeholder="Dorm"
                value={value ?? ""}
                setValue={onChange}
                containerClassName="mb-2"
              />
            )}
          />

          <View className="flex-col gap-2">
            <Text className="text-lg text-black/80 font-medium">Note</Text>

            <Controller
              name="note"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  className="border border-gray-400 rounded-md min-h-32 px-4 "
                  onChangeText={onChange}
                  value={value ?? ""}
                  placeholder="Add Any refelection or comment"
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              )}
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
              onPress={() => {
                if (Object.keys(errors).length > 0) {
                  let errorMessage = "Please fix the following errors:\n\n";

                  Object.entries(errors).forEach(([fieldName, error]) => {
                    const formattedFieldName = fieldName
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());

                    errorMessage += `• ${formattedFieldName}: ${
                      error?.message || "Invalid value"
                    }\n`;
                  });

                  Alert.alert("Form Validation Error", errorMessage);
                  return;
                }

                handleSubmit(onSubmit)();
              }}
              disabled={isCreating}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text className="text-white font-semibold text-base">
                  {isCreating ? "Creating ..." : "Create Plan"}
                </Text>
              </View>
            </Button>
          </View>

          <View className="flex-row items-center justify-center mt-4">
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#276359"
            />
            <Text className="text-primary-700 text-sm ml-2">
              Plan will be added to your weekly schedule
            </Text>
          </View>
        </View>
      </ScreenWrapper>
    </>
  );
}
