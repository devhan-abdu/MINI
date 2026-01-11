import { HifzSection } from "@/src/components/dashboard/HifzSection";
import { MurajaSection } from "@/src/components/dashboard/MurajaSection";
import { TodayTasksSection } from "@/src/components/dashboard/TodayTask";
import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";
import { SectionHeader } from "@/src/components/SectionHeader";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { View, Text, Image } from "react-native";
import { Button } from "@/src/components/ui/Button"; // Assuming you have a UI button
import { useRouter } from "expo-router";
import { useGetHifzPlan } from "@/src/features/hifz/hook/useGetHifzPlan";
import { useWeeklyMuraja } from "@/src/features/muraja/hooks/useWeeklyMuraja";
import { WelcomeIntro } from "@/src/components/dashboard/WelcomeIntro";

export default function Dashboard() {
  const router = useRouter();
  const { items: surah } = useLoadSurahData();
  const { hifz: hifzPlan, isLoading: loadingHifz } = useGetHifzPlan();
  const { weeklyPlan: murajaPlan, loading: loadingMuraja } =
    useWeeklyMuraja();

  const hasNoPlans = !hifzPlan && !murajaPlan;

  if (hasNoPlans && !loadingHifz && !loadingMuraja) {
    return (
      <Screen>
        <ScreenContent>
          <WelcomeIntro onStart={() => router.push("/create-hifz-plan")} />
        </ScreenContent>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenContent>
        <MurajaSection />

        <HifzSection surahData={surah} />

        <View className="mt-6 mb-32">
          <SectionHeader title="Today Task" />
          <TodayTasksSection surahData={surah} />
        </View>
      </ScreenContent>
    </Screen>
  );
}
