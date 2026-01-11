import React, { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {  useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Screen from "@/src/components/screen/Screen";
import {
  ScreenContent,
  ScreenFooter,
} from "@/src/components/screen/ScreenContent";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import SelectDays from "@/src/features/muraja/components/SelectDays";
import SurahDropdown, {
  SurahPageDropdown,
} from "@/src/features/muraja/components/SurahDropdown";

import { useSession } from "@/src/hooks/useSession";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { useCreatePlan } from "@/src/features/muraja/hooks/useCreatePlan";
import { getPlannedDates } from "@/src/features/muraja/utils/dateHelpers";
import { getWeeklyPlanData } from "@/src/features/muraja/utils/quranMapping";
import {
  WeeklyMurajaSchema,
  WeeklyMurajaFormType,
  IWeeklyMurajaDayInsert,
  WeeklyMurajaType,
} from "@/src/types";
import { SectionHeader } from "@/src/components/SectionHeader";

export default function CreateWeeklyPlan() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useSession();
  const { items } = useLoadSurahData();
  const { createPlan, isCreating } = useCreatePlan();

  const {
    handleSubmit,
    formState: { errors },
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

  const selectedSurah = useWatch({ control, name: "start_surah" });
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
      const quranData = getWeeklyPlanData(
        rest.start_page,
        rest.planned_pages,
        selectedDays.length,
        items
      );

      if (!quranData.startSurah || !quranData.endSurah) {
        Alert.alert("Error", "Could not calculate Quranic range.");
        return;
      }

      const planPayload: WeeklyMurajaType = {
        ...rest,
        user_id: user.id,
        end_surah: quranData.endSurah,
        start_surah: quranData.startSurah,
        end_page: quranData.endPage,
        start_juz: quranData.startJuz!,
        end_juz: quranData.endJuz!,
        total_days: selectedDays.length,
        week_end_date: endDate,
        status: "active",
      };

      const daysPayload: IWeeklyMurajaDayInsert[] = calculatedDays.map(
        (day) => ({
          day_of_week: day.day_of_week,
          date: day.date,
          planned_start_page: day.planned_start_page!,
          planned_end_page: day.planned_end_page!,
          planned_pages: rest.planned_pages!,
          estimated_time_min: rest.estimated_time_min!,
        })
      );

      await createPlan({ planData: planPayload, days: daysPayload });
      Alert.alert("Success", "Plan created!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const formattedWeekStart = weekStart
    ? new Date(weekStart).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  const ErrorMessage = ({ error }: { error: any }) => {
    if (!error) return null;
    return (
      <View className="flex-row items-center mt-1 ml-1 gap-x-1">
        <Ionicons name="alert-circle-outline" size={12} color="#ef4444" />
        <Text className="text-red-500 text-[10px] font-bold uppercase tracking-tight">
          {error.message}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Screen>
        <ScreenContent>
          <View className="bg-white border border-slate-100 rounded-[32px] p-5 mb-8 shadow-sm shadow-slate-200/50">
            <Controller
              control={control}
              name="week_start_date"
              render={({ field: { value, onChange } }) => (
                <View>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className={`flex-row items-center justify-between active:opacity-60 ${
                      errors.week_start_date
                        ? "border border-red-100 p-2 rounded-xl"
                        : ""
                    }`}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center">
                        <Ionicons name="calendar" size={22} color="#276359" />
                      </View>
                      <View>
                        <Text className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-0.5">
                          Start Date
                        </Text>
                        <Text
                          className={`text-base font-black ${
                            formattedWeekStart
                              ? "text-slate-900"
                              : "text-slate-300"
                          }`}
                        >
                          {formattedWeekStart || "Select Start Date"}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#cbd5e1"
                    />
                  </Pressable>
                  <ErrorMessage error={errors.week_start_date} />
                  {showDatePicker && (
                    <DateTimePicker
                      value={value ? new Date(value) : new Date()}
                      mode="date"
                      onChange={(e, date) => {
                        setShowDatePicker(false);
                        if (date) onChange(date.toISOString().slice(0, 10));
                      }}
                    />
                  )}
                </View>
              )}
            />
            <View className="h-[1px] bg-slate-50 my-5" />
            <Controller
              name="selectedDays"
              control={control}
              render={({ field: { value, onChange } }) => (
                <View>
                  <Text className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 ml-1">
                    Weekly Routine
                  </Text>
                  <SelectDays value={value ?? []} onChange={onChange} />
                  <ErrorMessage error={errors.selectedDays} />
                </View>
              )}
            />
          </View>

          <SectionHeader title="Reading Target" />
          <View className="bg-white border border-slate-100 rounded-[32px] p-5 mb-8 shadow-sm shadow-slate-200/50 gap-y-4">
            <Controller
              control={control}
              name="start_surah"
              render={({ field: { value, onChange } }) => (
                <View>
                  <SurahDropdown surah={value} setSurah={onChange} />
                  <ErrorMessage error={errors.start_surah} />
                </View>
              )}
            />
            <Controller
              control={control}
              name="start_page"
              render={({ field: { value, onChange } }) => (
                <View>
                  <SurahPageDropdown
                    surah={selectedSurah}
                    setPage={onChange}
                    page={value}
                  />
                  <ErrorMessage error={errors.start_page} />
                </View>
              )}
            />
            <Controller
              control={control}
              name="planned_pages"
              render={({ field: { value, onChange } }) => (
                <View>
                  <Input
                    label="Daily Page Goal"
                    placeholder="20"
                    value={String(value)}
                    setValue={(v) => onChange(Number(v))}
                    keyboardType="numeric"
                    leftIcon={
                      <Ionicons
                        name="document-text-outline"
                        size={18}
                        color="#94a3b8"
                      />
                    }
                  />
                  <ErrorMessage error={errors.planned_pages} />
                </View>
              )}
            />
          </View>

          <SectionHeader title="Details" />
          <View className="bg-white border border-slate-100 rounded-[32px] p-5 mb-10 shadow-sm shadow-slate-200/50 gap-y-5">
            <Controller
              control={control}
              name="estimated_time_min"
              render={({ field: { value, onChange } }) => (
                <View>
                  <Input
                    label="Daily Duration"
                    value={String(value)}
                    setValue={(v) => onChange(Number(v))}
                    keyboardType="numeric"
                    leftIcon={
                      <Ionicons name="time-outline" size={18} color="#94a3b8" />
                    }
                    rightIcon={
                      <Text className="text-slate-400 font-bold text-[10px] uppercase">
                        min
                      </Text>
                    }
                  />
                  <ErrorMessage error={errors.estimated_time_min} />
                </View>
              )}
            />
            <Controller
              control={control}
              name="place"
              render={({ field: { value, onChange } }) => (
                <View>
                  <Input
                    label="Location"
                    placeholder="e.g. Mosque"
                    value={value ?? ""}
                    setValue={onChange}
                    leftIcon={
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#94a3b8"
                      />
                    }
                  />
                  <ErrorMessage error={errors.place} />
                </View>
              )}
            />
            <View>
              <Text className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2 ml-1">
                Personal Notes
              </Text>
              <Controller
                name="note"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <View>
                    <TextInput
                      className={`bg-slate-50 rounded-2xl p-4 min-h-[100px] text-slate-900 font-medium border ${
                        errors.note ? "border-red-500" : "border-slate-100"
                      } focus:border-primary/40 focus:bg-white`}
                      onChangeText={onChange}
                      value={value ?? ""}
                      placeholder="Set an intention or reminder..."
                      multiline
                      textAlignVertical="top"
                    />
                    <ErrorMessage error={errors.note} />
                  </View>
                )}
              />
            </View>
          </View>
        </ScreenContent>

        <ScreenFooter>
          <View className="flex-row gap-3 mb-16">
            <Button
              variant="outline"
              className="flex-1 h-14 border-slate-200"
              onPress={() => router.back()}
            >
              <Text className="text-slate-500 font-black uppercase text-[11px] tracking-widest">
                Cancel
              </Text>
            </Button>
            <Button
              className="flex-[2] h-14 bg-primary shadow-lg shadow-primary/20"
              onPress={handleSubmit(onSubmit)}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View className="flex-row items-center justify-center gap-2">
                  <Ionicons name="rocket-outline" size={18} color="#fff" />
                  <Text className="text-white font-black uppercase text-[11px] tracking-widest">
                    Launch Plan
                  </Text>
                </View>
              )}
            </Button>
          </View>
        </ScreenFooter>
      </Screen>
    </>
  );
}
