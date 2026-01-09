import { LogPageSkeleton } from "@/src/features/muraja/components/skeletons";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useMurajaOperation } from "@/src/features/muraja/hooks/useMurajaOperation";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { ScreenContent, ScreenFooter } from "@/src/components/screen/ScreenContent";
import Screen from "@/src/components/screen/Screen";
import { StatusTab } from "@/src/features/hifz/components/StatusTab";

type StatusType = "pending" | "completed" | "partial" | "missed";

export default function LogPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { weeklyPlan, plans, loading } = useWeeklyMuraja();
  const { updateLog, isUpdating } = useMurajaOperation();

  const plan = useMemo(
    () => plans.find((p) => p.id === Number(id)),
    [plans, id]
  );

  const [status, setStatus] = useState<StatusType>("pending");
  const [pages, setPages] = useState(plan?.planned_pages || 1);
  const [min, setMin] = useState("");
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const existingLog = plan?.daily_muraja_logs?.[0];
    if (existingLog) {
      setStatus(existingLog.status as StatusType);
      setPages(existingLog.completed_pages ?? plan.planned_pages);
      setMin(existingLog.actual_time_min?.toString() ?? plan.estimated_time_min);
      setPlace(existingLog.place ?? "");
      setNote(existingLog.note ?? "");
    }
  }, [plan]);

  if (loading) return <LogPageSkeleton />;
  if (!plan) return;

  const today = new Date().toISOString().slice(0, 10);
  const isToday = plan.date === today;
  const showDetails = status !== "missed";

  const formattedDate = new Intl.DateTimeFormat("en-Us", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(plan.date));

  const handleSave = async () => {
    setError("");

    if (status === "pending") {
      setError("please select the status");
      return;
    }

    try {
      await updateLog({
        dayId: plan.id,
        status,
        date: today,
        completed_pages: pages ? Number(pages) : undefined,
        actual_time_min: min ? Number(min) : undefined,
        place,
        note,
      });

      Alert.alert("Success", "Muraja'a logged successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", "Failed to save log");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: formattedDate,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#111",
        }}
      />

      <Screen>
        <ScreenContent>
          <View className="bg-primary p-6 rounded-[32px] mb-8 shadow-xl shadow-green-900/20">
            <Text className="text-white/60 font-bold text-[10px] uppercase tracking-widest mb-2">
              Today's Task
            </Text>

            <Text className="text-white text-3xl font-black mb-6">
              {plan.startSurah === plan.endSurah
                ? plan.startSurah
                : `${plan.startSurah} – ${plan.endSurah}`}
            </Text>

            <View className="flex-row items-center justify-between border-t border-white/10 pt-5">
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="book-outline" size={16} color="#fff" />
                <Text className="text-sm text-white font-medium">
                  page {plan.planned_start_page} - {plan.planned_end_page}
                </Text>
              </View>

              <View className="h-6 w-px bg-gray-300" />

              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text className="text-sm text-white font-medium">
                  {weeklyPlan?.estimated_time_min} min
                </Text>
              </View>

              <View className="h-6 w-px bg-gray-300" />

              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="layers-outline" size={16} color="#fff" />
                <Text className="text-sm text-white font-medium">
                  {weeklyPlan?.planned_pages} pages
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-xl font-black text-gray-900 mb-4">
            How did it go?
          </Text>
          <View className="flex-row justify-between mb-8">
            <StatusTab
              label="Completed"
              icon="checkmark-circle"
              active={status === "completed"}
              onPress={() => {
                setStatus("completed");
                setPages(plan.planned_pages);
              }}
            />
            <StatusTab
              label="Partial"
              icon="contrast"
              active={status === "partial"}
              onPress={() => setStatus("partial")}
            />
            <StatusTab
              label="Missed"
              icon="close-circle"
              active={status === "missed"}
              onPress={() => {
                setStatus("missed");
                setPages(0);
              }}
            />
          </View>
          {showDetails && (
            <View className=" mb-12 gap-2">
              <View className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 flex-row items-center justify-between mb-8">
                <View>
                  <Text className="font-black text-gray-900 text-lg">
                    Pages Memorized
                  </Text>
                  <Text className="text-gray-400 text-xs font-medium">
                    Actual progress today
                  </Text>
                </View>
                <View className="flex-row items-center bg-white rounded-2xl p-1.5 border border-gray-200">
                  <Pressable
                    onPress={() => setPages((prev) => Math.max(0, prev - 1))}
                    className="w-10 h-10 items-center justify-center active:bg-gray-50 rounded-xl"
                  >
                    <Ionicons name="remove" size={20} color="#276359" />
                  </Pressable>
                  <Text className="text-2xl font-black text-gray-900 px-4">
                    {pages}
                  </Text>
                  <Pressable
                    onPress={() => setPages((prev) => prev + 1)}
                    className="w-10 h-10 items-center justify-center active:bg-gray-50 rounded-xl"
                  >
                    <Ionicons name="add" size={20} color="#276359" />
                  </Pressable>
                </View>
              </View>
              <View className="mb-2">
                <Text className="text-gray-400 font-bold uppercase text-[10px] mb-2 ml-1 tracking-widest">
                  Time Spent (minutes)
                </Text>
                <Input
                  placeholder="Time spent (min)"
                  value={min}
                  setValue={setMin}
                  type="numeric"
                />
              </View>
              <View className="mb-2">
                <Text className="text-gray-400 font-bold uppercase text-[10px] mb-2 ml-1 tracking-widest">
                  Place
                </Text>
                <Input
                 placeholder="Place (optional)" 
                  value={place}
                  setValue={setPlace}
                  type="numeric"
                />
              </View>
             
              <View className="">
                <Text className="text-gray-400 font-bold uppercase text-[10px] mb-2 ml-1 tracking-widest">
                  Reflection or Notes
                </Text>
                <TextInput
                  multiline
                  placeholder="Difficulties with specific ayahs?"
                  placeholderTextColor="#9ca3af"
                  value={note}
                  onChangeText={setNote}
                  className="bg-gray-50 p-5 rounded-[28px] border border-gray-100 h-32 text-gray-900 font-medium"
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
          {error && <Text className="text-red-500 my-3">{error}</Text>}
        </ScreenContent>
        <ScreenFooter>
           <Button
                 onPress={handleSave}
                    disabled={isUpdating}
                    className="bg-primary h-14  shadow-lg shadow-primary/30"
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-white font-black text-lg mr-2">
                        Save Progress
                      </Text>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </View>
                  </Button>
        </ScreenFooter>
      </Screen>
    </>
  );
}
