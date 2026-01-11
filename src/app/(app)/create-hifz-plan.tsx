import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Alert, Pressable, Text, View, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "@/src/components/ui/Input";
import SurahDropdown, {
  SurahPageDropdown,
} from "@/src/features/muraja/components/SurahDropdown";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { useSession } from "@/src/hooks/useSession";
import {
  HifzPlanSchema,
  HifzPlanSchemaFormType,
} from "@/src/features/hifz/types";
import SelectDays from "@/src/features/muraja/components/SelectDays";
import StatsSummary from "@/src/features/hifz/components/StatsSummary";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { useSaveHifzPlanHifz } from "@/src/features/hifz/hook/useSaveHifzPlan";
import PlanFormSkeleton from "@/src/features/hifz/components/skeleton";
import {
  ScreenContent,
  ScreenFooter,
} from "@/src/components/screen/ScreenContent";
import Screen from "@/src/components/screen/Screen";
import { calculatePlanStats } from "@/src/features/hifz/utils/plan-calculations";

export default function CreateHifzPlan() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useSession();
  const { hifz: existingPlan, isLoading } = useGetHifzPlan();
  const { savePlan, isSaving } = useSaveHifzPlanHifz(existingPlan?.id);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(HifzPlanSchema),
    defaultValues: {
      start_date: new Date().toISOString().split("T")[0],
      selectedDays: [],
      pages_per_day: 2,
      start_surah: 1,
      start_page: 1,
      direction: "forward",
    },
  });

  useEffect(() => {
    if (existingPlan) {
      reset({
        start_date: existingPlan.start_date,
        selectedDays: existingPlan.selected_days,
        pages_per_day: existingPlan.pages_per_day,
        start_surah: existingPlan.start_surah,
        start_page: existingPlan.start_page,
        direction: existingPlan.direction,
      });
    }
  }, [existingPlan, reset]);

  const onSubmit = async (data: HifzPlanSchemaFormType) => {
    if (!user?.id) return;
    try {
      const stats = calculatePlanStats(data);
      const { selectedDays, ...rest } = data;

      const planData = {
        ...rest,
        selected_days: selectedDays,
        total_pages: stats.totalPages,
        estimated_end_date: stats.finishDate.toISOString().slice(0, 10),
        days_per_week: data.selectedDays.length,
      };
      await savePlan(planData);
      Alert.alert(
        "Success",
        existingPlan ? "Plan updated!" : "Journey started!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const startSurah = useWatch({ control, name: "start_surah" });

  if (isLoading) return <PlanFormSkeleton />;

  return (
    <>
      <Stack.Screen
        options={{ title: existingPlan ? "Edit Plan" : "New Hifz Plan" }}
      />
      <Screen>
        <ScreenContent>
          <View className="mb-6">
            <Controller
              control={control}
              name="direction"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row bg-gray-100 p-1 rounded-full">
                  <Pressable
                    onPress={() => onChange("forward")}
                    className={`flex-1 py-3 rounded-full ${
                      value === "forward" ? "bg-primary shadow" : ""
                    }`}
                  >
                    <Text
                      className={`text-center font-bold ${
                        value === "forward" ? "text-white" : "text-gray-500"
                      }`}
                    >
                      Traditional
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onChange("backward")}
                    className={`flex-1 py-3 rounded-full ${
                      value === "backward" ? "bg-primary shadow" : ""
                    }`}
                  >
                    <Text
                      className={`text-center font-bold ${
                        value === "backward" ? "text-white" : "text-gray-500"
                      }`}
                    >
                      Juz Amma First
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>

          <StatsSummary control={control} />

          <View className="mb-6">
            <Text className="text-gray-400 font-bold text-[10px] uppercase mb-2 ml-1">
              Start Date
            </Text>
            <Controller
              control={control}
              name="start_date"
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className={`bg-white border p-4 rounded-2xl flex-row justify-between ${
                    errors.start_date ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <Text className="text-base font-medium">
                    {new Date(value).toDateString()}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#276359" />
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(value)}
                      onChange={(e, d) => {
                        setShowDatePicker(false);
                        if (d) onChange(d.toISOString().split("T")[0]);
                      }}
                    />
                  )}
                </Pressable>
              )}
            />
            {errors.start_date && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.start_date.message}
              </Text>
            )}
          </View>

          <View className="mb-6">
            <Controller
              control={control}
              name="pages_per_day"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="PAGES / DAY"
                  value={String(value)}
                  setValue={(v) => onChange(Number(v))}
                  keyboardType="numeric"
                  error={errors.pages_per_day?.message}
                />
              )}
            />
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-gray-400 font-bold text-[10px] uppercase mb-2 ml-1">
                Start Surah
              </Text>
              <Controller
                control={control}
                name="start_surah"
                render={({ field: { value, onChange } }) => (
                  <View>
                    <SurahDropdown surah={value} setSurah={onChange} />
                    {errors.start_surah && (
                      <Text className="text-[10px] text-red-500 mt-1">
                        {errors.start_surah.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 font-bold text-[10px] uppercase mb-2 ml-1">
                Start Page
              </Text>
              <Controller
                control={control}
                name="start_page"
                render={({ field: { value, onChange } }) => (
                  <View>
                    <SurahPageDropdown
                      surah={startSurah}
                      page={value}
                      setPage={onChange}
                    />
                    {errors.start_page && (
                      <Text className="text-[10px] text-red-500 mt-1">
                        {errors.start_page.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <View className="mb-10">
            <Text className="text-gray-400 font-bold text-[10px] uppercase mb-2 ml-1">
              Weekly Schedule
            </Text>
            <Controller
              name="selectedDays"
              control={control}
              render={({ field: { value, onChange } }) => (
                <View>
                  <SelectDays value={value ?? []} onChange={onChange} />
                  {errors.selectedDays && (
                    <Text className="text-xs text-red-500 mt-2">
                      {errors.selectedDays.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </ScreenContent>

        <ScreenFooter>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-primary h-14 rounded-2xl mb-12"
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black uppercase tracking-widest">
                {existingPlan ? "Update Plan" : "Create Plan"}
              </Text>
            )}
          </Button>
        </ScreenFooter>
      </Screen>
    </>
  );
}
