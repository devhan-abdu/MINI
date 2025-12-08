import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "@/src/components/ui/Input";
import SurahDropdown, {
  SurahPageDropdown,
} from "@/src/components/SurahDropdown";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IWeeklyMurajaDay,
  WeeklyMurajaSchema,
  WeeklyMurajaType,
} from "@/src/types";
import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { addWeeklyPlan, addWeeklyPlanDays } from "@/src/services";
import { useSession } from "@/src/hooks/useSession";
import { getPlannedDates } from "@/src/lib/utils";

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

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(WeeklyMurajaSchema),
    defaultValues: {
      user_id: undefined,
      week_start_date: "",
      planned_pages: undefined,
      start_surah: undefined,
      start_page: undefined,
      estimated_time_min: undefined,
      selectedDays: [],
      place: "",
      note: "",
    },
  });

  const selectedSurah = useWatch({
    control,
    name: "start_surah",
  });
  const onSubmit = async (data: WeeklyMurajaType) => {
    try {
      const planData = await addWeeklyPlan({
        ...data,
        user_id: Number(user?.id),
      });

      const weekly_plan_id = planData[0].id;

      const selectedDaysRaw = useWatch({ control, name: "selectedDays" });
      const selectedDays = (selectedDaysRaw as (number | undefined)[]).filter(
        (d): d is number => d !== undefined
      );
      const weekStart = useWatch({ control, name: "week_start_date" });
      const startPage = useWatch({ control, name: "start_page" });
      const plannedPages = useWatch({ control, name: "planned_pages" });

      const plannedDays: IWeeklyMurajaDay[] = getPlannedDates(
        weekStart,
        selectedDays,
        plannedPages,
        startPage
      ).map((day) => ({
        ...day,
        weekly_plan_id,
      }));

      await addWeeklyPlanDays(plannedDays);
    } catch (error) {
      Alert.alert("Failed to add weekly plan");
    }
  };

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
                <Pressable onPress={() => setShowDatePicker(true)}>
                  <Text>
                    {value
                      ? new Date(value).toLocaleDateString()
                      : "Select start date"}
                  </Text>
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
                      flex-1 min-w-[72px] h-12 rounded-sm border bg-white
                      ${
                        isSelected
                          ? "border-green-100 bg-green-100 text-green-900"
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
                //{" "}
              </View>
            )}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-3">Daily Reading Goal</Text>
          <View className="">
            <Controller
              control={control}
              name="planned_pages"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="number of page ."
                  value={String(value)}
                  setValue={(v) => onChange(Number(v))}
                  keyboardType="numeric"
                  leftIcon={
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#6B7280"
                    />
                  }
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
                placeholder="e.g. 30"
                value={value ?? ""}
                setValue={onChange}
                keyboardType="numeric"
                //   icon for the place
                // leftIcon={
                //   <Ionicons name="time-outline" size={20} color="#6B7280" />
                // }
                // rightIcon={<Text className="text-gray-500">min/day</Text>}
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
                  value={value}
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

            <Button className="flex-1" onPress={handleSubmit(onSubmit)}>
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text className="text-white font-semibold text-base">
                  Create Plan
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
