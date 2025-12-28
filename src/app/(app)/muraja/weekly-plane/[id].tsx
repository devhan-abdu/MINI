import ScreenWrapper from "@/src/components/ScreenWrapper";
import { LogPageSkeleton } from "@/src/features/muraja/components/skeletons";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useMurajaOperation } from "@/src/features/muraja/hooks/useMurajaOperation";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";

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
  const [pages, setPages] = useState("");
  const [min, setMin] = useState("");
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const existingLog = plan?.daily_muraja_logs?.[0];
    if (existingLog) {
      setStatus(existingLog.status as StatusType);
      setPages(existingLog.completed_pages?.toString() ?? "");
      setMin(existingLog.actual_time_min?.toString() ?? "");
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
        }}
      />

      <ScreenWrapper>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-left mb-4">
            {plan.startSurah === plan.endSurah
              ? plan.startSurah
              : `${plan.startSurah} – ${plan.endSurah}`}
          </Text>

          <View className="flex-row items-center justify-between px-2 border-t border-gray-200 pt-4">
            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name="book-outline" size={16} color="#4b5563" />
              <Text className="text-sm text-gray-700 font-medium">
                page {plan.planned_start_page} - {plan.planned_end_page}
              </Text>
            </View>

            <View className="h-6 w-px bg-gray-300" />

            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name="time-outline" size={16} color="#4b5563" />
              <Text className="text-sm text-gray-700 font-medium">
                {weeklyPlan?.estimated_time_min} min
              </Text>
            </View>

            <View className="h-6 w-px bg-gray-300" />

            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name="layers-outline" size={16} color="#4b5563" />
              <Text className="text-sm text-gray-700 font-medium">
                {weeklyPlan?.planned_pages} pages
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-2xl font-semibold mb-4">Status</Text>
        <View className="flex-row bg-gray-100 rounded-xl">
          {["completed", "partial", "missed"].map((s) => (
            <Pressable
              key={s}
              onPress={() => setStatus(s as StatusType)}
              className={`flex-1 py-3 rounded-xl ${
                status === s ? "bg-primary shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-center font-bold capitalize ${
                  status === s ? "text-white" : "text-gray-500"
                }`}
              >
                {s}
              </Text>
            </Pressable>
          ))}
        </View>
        {showDetails && (
          <View className="mt-8  mb-12 gap-2">
            <View className="flex-col gap-2">
              <Text className="text-lg text-black/80 font-medium">
                Pages completed
              </Text>
              <Input
                placeholder="Pages completed"
                value={pages}
                setValue={setPages}
                type="numeric"
              />
            </View>
            <View className="flex-col gap-2">
              <Text className="text-lg text-black/80 font-medium">
                {" "}
                Time Spent (minutes)
              </Text>
              <Input
                placeholder="Time spent (min)"
                value={min}
                setValue={setMin}
                type="numeric"
              />
            </View>

            <View className="flex-col gap-2">
              <Text className="text-lg text-black/80 font-medium">Place</Text>
              <Input
                placeholder="Place (optional)"
                value={place}
                setValue={setPlace}
              />
            </View>

            <View className="flex-col gap-2">
              <Text className="text-lg text-black/80 font-medium">Note</Text>

              <TextInput
                className="border border-gray-700 rounded-md p-3 min-h-24"
                placeholder="Reflection or note"
                multiline
                value={note}
                textAlignVertical="top"
                onChangeText={setNote}
              />
            </View>
          </View>
        )}
        {error && <Text className="text-red-500 my-3">{error}</Text>}
        <Button
          disabled={isUpdating}
          className="mt-auto  mb-8"
          onPress={handleSave}
        >
          Save
        </Button>
      </ScreenWrapper>
    </>
  );
}
