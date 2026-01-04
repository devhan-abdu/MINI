import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "@/src/components/ui/Input";
import SurahDropdown, {
  SurahPageDropdown,
} from "@/src/features/muraja/components/SurahDropdown";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { useSession } from "@/src/hooks/useSession";
import {
  HifzPlanSchema,
  HifzPlanSchemaFormType,
  IHifzPlan,
} from "@/src/features/hifz/types";
import SelectDays from "@/src/features/muraja/components/SelectDays";
import { hifzServices } from "@/src/features/hifz/services/hifz";
import { calculatePlanStats } from "@/src/features/hifz/utils";
import StatsSummary from "@/src/features/hifz/components/StatsSummary";

export default function CreateHifzPlan() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useSession();

  const isCreating = false;

  const {
    handleSubmit,
    formState: { errors },
    control,
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

  const onSubmit = async (data: HifzPlanSchemaFormType) => {
    if (!user?.id) return;

    try {
      const stats = calculatePlanStats(data);
      const { selectedDays, ...rest } = data;

      const planData: Omit<IHifzPlan, "hifz_daily_logs"> = {
        ...rest,
        user_id: user.id,
        selected_days: selectedDays,
        total_pages: stats.totalPages,
        estimated_end_date: stats.finishDate.toISOString().slice(0, 10),
        status: "active",
        days_per_week: data.selectedDays.length,
      };

      await hifzServices.createPlan({ planData });
      Alert.alert("Success", "Hifz plan created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(` ${error.message}`);
    }
  };

  const startSurah = useWatch({ control, name: "start_surah" });

  return (
    <>
      <Stack.Screen
        options={{
          title: "New Hifz Journey",
          headerShown: true,
          headerShadowVisible: true,
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#111827",
          headerTitleStyle: { fontWeight: "600" },
        }}
      />

      <ScreenWrapper>
        <View>
          <Controller
            control={control}
            name="direction"
            render={({ field: { value, onChange } }) => (
              <View className="mb-6">
                <View className="flex-row items-center justify-center bg-gray-100/70 p-1.5 rounded-full border border-gray-200/40">
                  <Pressable
                    onPress={() => {
                      console.log("Setting forward");
                      onChange("forward");
                    }}
                    className={`
          px-6 py-3 rounded-full mx-1 w-1/2 max-w-54
          transition-all duration-300 ease-in-out
          ${value === "forward" ? "bg-primary " : "bg-transparent"}
        `}
                  >
                    <Text
                      className={`
            font-semibold text-base tracking-wide text-center
            ${value === "forward" ? "text-white" : "text-gray-600"}
          `}
                    >
                      Traditional
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      console.log("Setting backward");
                      onChange("backward");
                    }}
                    className={`
          px-6 py-3 rounded-full mx-1 w-1/2  max-w-54
          transition-all duration-300 ease-in-out
          ${value === "backward" ? "bg-primary " : "bg-transparent"}
        `}
                  >
                    <Text
                      className={`
            font-semibold text-base tracking-wide text-center
            ${value === "backward" ? "text-white" : "text-gray-600"}
          `}
                    >
                      Reverse Juz Amma
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
          {errors.direction && (
            <Text className="text-sm text-red-500">
              {errors.direction.message}
            </Text>
          )}
        </View>

        <StatsSummary control={control} />

        <View className="mb-6">
          <Text className="text-gray-900 font-semibold mb-2.5">START DATE</Text>
          <Controller
            control={control}
            name="start_date"
            render={({ field: { value, onChange } }) => (
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-white border border-gray-200 p-4 rounded-2xl flex-row justify-between"
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
            <Text className="text-sm text-red-500">
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
                containerClassName="flex-1"
              />
            )}
          />
          {errors.pages_per_day && (
            <Text className="text-sm text-red-500">
              {errors.pages_per_day.message}
            </Text>
          )}
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold mb-2.5 uppercase">
              Start Surah
            </Text>
            <Controller
              control={control}
              name="start_surah"
              render={({ field: { value, onChange } }) => (
                <SurahDropdown surah={value} setSurah={onChange} />
              )}
            />
            {errors.start_surah && (
              <Text className="text-sm text-red-500">
                {errors.start_surah.message}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold mb-2.5 uppercase">
              Page num
            </Text>
            <Controller
              control={control}
              name="start_page"
              render={({ field: { value, onChange } }) => (
                <SurahPageDropdown
                  surah={startSurah}
                  page={value}
                  setPage={onChange}
                />
              )}
            />
            {errors.start_page && (
              <Text className="text-sm text-red-500">
                {errors.start_page.message}
              </Text>
            )}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-900 font-semibold mb-2.5 uppercase">
            Select Days
          </Text>
          <Text className="text-gray-500 text-sm mb-4">
            Choose which days you want Hifz
          </Text>
          <Controller
            name="selectedDays"
            control={control}
            render={({ field: { value, onChange } }) => (
              <SelectDays value={value ?? []} onChange={onChange} />
            )}
          />
          {errors.selectedDays && (
            <Text className="text-red-500">{errors.selectedDays.message}</Text>
          )}
        </View>

        <View className="mt-10 mb-20">
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isCreating}
            className=" rounded-2xl shadow-lg"
          >
            <Text className="text-white font-bold text-lg">Start Journey</Text>
          </Button>
        </View>
      </ScreenWrapper>
    </>
  );
}
