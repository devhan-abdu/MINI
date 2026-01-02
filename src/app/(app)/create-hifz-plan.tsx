import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
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
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { HifzPlanSchema } from "@/src/features/hifz/types";

export default function CreateHifzPlan() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useSession();
  const { items } = useLoadSurahData();

  const isCreating = false;

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(HifzPlanSchema),
    defaultValues: {
      start_date: new Date().toISOString().split("T")[0],
      days_per_week: 5,
      pages_per_day: 1,
      start_surah: 1,
      start_page: 1,
      direction: "forward",
      note: "",
    },
  });

  const formData = useWatch({ control });

  const calculateStats = () => {
    const totalQuranPages = 604;
    const startPage = formData.start_page || 1;

    const totalPages =
      formData.direction === "forward"
        ? totalQuranPages - startPage + 1
        : startPage;

    const dailyRate = formData.pages_per_day || 1;
    const weeklyFreq = formData.days_per_week || 5;

    const daysNeeded = Math.ceil((totalPages / dailyRate) * (7 / weeklyFreq));

    const finishDate = new Date(formData.start_date || new Date());
    finishDate.setDate(finishDate.getDate() + daysNeeded);

    return { totalPages, finishDate, daysNeeded };
  };

  const stats = calculateStats();

  const onSubmit = async (data: any) => {
    if (!user?.id) return;
    console.log("Hifz Plan Data:", { ...data, ...stats });
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "New Hifz Journey", headerShown: true }}
      />
      <ScreenWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row bg-gray-100 p-1 rounded-2xl mb-6">
            {["forward", "backward"].map((dir) => (
              <Pressable
                key={dir}
                onPress={() => setValue("direction", dir as any)}
                className={`flex-1 py-3 rounded-xl items-center ${
                  formData.direction === dir ? "bg-white shadow-sm" : ""
                }`}
              >
                <Text
                  className={`font-bold ${
                    formData.direction === dir
                      ? "text-primary-700"
                      : "text-gray-500"
                  }`}
                >
                  {dir === "forward" ? "Traditional" : "Reverse (Juz Amma)"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="bg-primary-900 p-6 rounded-3xl mb-8 shadow-xl">
            <Text className="text-primary-100/70 text-xs uppercase font-bold tracking-widest mb-1">
              Estimated Finish Date
            </Text>
            <Text className="text-white text-3xl font-black mb-4">
              {stats.finishDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>

            <View className="flex-row border-t border-white/10 pt-4 justify-between">
              <View>
                <Text className="text-primary-100/50 text-xs font-bold uppercase">
                  Total Pages
                </Text>
                <Text className="text-white text-lg font-bold">
                  {stats.totalPages} Pages
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-primary-100/50 text-xs font-bold uppercase">
                  Journey Length
                </Text>
                <Text className="text-white text-lg font-bold">
                  ~{Math.round(stats.daysNeeded / 30)} Months
                </Text>
              </View>
            </View>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-gray-500 font-bold mb-2 ml-1">
                START DATE
              </Text>
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
            </View>

            <View className="flex-row gap-4">
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
              <Controller
                control={control}
                name="days_per_week"
                render={({ field: { value, onChange } }) => (
                  <Input
                    label="DAYS / WEEK"
                    value={String(value)}
                    setValue={(v) => onChange(Number(v))}
                    keyboardType="numeric"
                    containerClassName="flex-1"
                  />
                )}
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="start_surah"
                  render={({ field: { value, onChange } }) => (
                    <SurahDropdown surah={value} setSurah={onChange} />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="start_page"
                  render={({ field: { value, onChange } }) => (
                    <SurahPageDropdown
                      surah={formData.start_surah ?? null}
                      page={value}
                      setPage={onChange}
                    />
                  )}
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-500 font-bold mb-2 ml-1">NOTES</Text>
              <Controller
                control={control}
                name="note"
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    value={value ?? ""}
                    onChangeText={onChange}
                    placeholder="E.g. Focusing on Juz Amma first..."
                    multiline
                    className="bg-white border border-gray-200 p-4 rounded-2xl min-h-[100px]"
                    textAlignVertical="top"
                  />
                )}
              />
            </View>
          </View>

          <View className="mt-10 mb-20">
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isCreating}
              className="h-16 rounded-2xl shadow-lg"
            >
              <Text className="text-white font-bold text-lg">
                Start Journey
              </Text>
            </Button>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </>
  );
}
