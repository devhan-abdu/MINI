import ScreenWrapper from "@/src/components/ScreenWrapper";
import { LogPageSkeleton } from "@/src/components/skeletons";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useSession } from "@/src/hooks/useSession";
import { useWeeklyDays } from "@/src/hooks/useWeeklyDays";
import { useWeeklyPlan } from "@/src/hooks/useWeeklyPlan";
import { addDailyLog, getWeeklyPlanLog } from "@/src/services";
import { IDayLog, IDayLogAdd } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

type StatusType = "pending" | "completed" | "partial" | "missed";

export default function LogPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useSession();

  const { weeklyPlan } = useWeeklyPlan(user?.id || null);
  const { plans, loading } = useWeeklyDays(
    user?.id ?? null,
    weeklyPlan?.id ?? null
  );

  const plan = useMemo(
    () => plans.find((p) => p.id === Number(id)),
    [plans, id]
  );

  const [existingLog, setExistingLog] = useState<IDayLog | null>(null);

  const [status, setStatus] = useState<StatusType>("pending");
  const [pages, setPages] = useState("");
  const [min, setMin] = useState("");
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id || !plan?.id) return;

    getWeeklyPlanLog(user.id, plan.id).then((log) => {
      if (!log) return;

      setExistingLog(log);
      setStatus(log.status);
      setPages(log.completed_pages?.toString() ?? "");
      setMin(log.actual_time_min?.toString() ?? "");
      setPlace(log.place ?? "");
      setNote(log.note ?? "");
    });
  }, [user?.id, plan?.id]);

  if (loading) return <LogPageSkeleton />;
  if (!plan) return;

  const today = new Date().toISOString().slice(0, 10);
  const isToday = plan.date === today;

  const formattedDate = new Intl.DateTimeFormat("en-Us", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(plan.date));

  const showDetails = status !== "missed" || !!existingLog;

  const handleSave = async () => {
    setError("");

    if (status === "pending") {
      setError("please select the status");
      return;
    }

    const payLoad: Partial<IDayLogAdd> = {
      dayId: plan.id,
      userId: user?.id,
      date: today,
      status,
      ...(pages && { pages: Number(pages) }),
      ...(min && { min: Number(min) }),
      ...(place && { place }),
      ...(note && { note }),
    };
    try {
      await addDailyLog(payLoad);
      Alert.alert("Success", "Weekly plan log successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", `Failed to add  weekly plan log  `);
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
              disabled={!isToday}
              onPress={() => setStatus(s as StatusType)}
              className={`flex-1 p-3 rounded-xl ${
                status === s ? "bg-primary" : ""
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  status === s ? "text-white" : "text-primary"
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
        <Button className="mt-auto  mb-8" onPress={handleSave}>
          Save
        </Button>
      </ScreenWrapper>
    </>
  );
}
