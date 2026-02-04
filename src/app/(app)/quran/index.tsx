import React from "react";
import { View, Text, ActivityIndicator, SectionList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGetSurahByJuz } from "@/src/hooks/useGetSurahByJuz";
import { JuzHeader } from "@/src/features/quran/components/JuzHeader";
import { SurahRow } from "@/src/features/quran/components/SurahRow";
import { Surah } from "@/src/features/quran/type";

export default function SurahIndex() {
  const router = useRouter();
  const { displayData, loading, error } = useGetSurahByJuz();

  const handlePress = (item: Surah) => {
    router.push(`/quran/reader?page=${item.startingPage}`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#276359" />
        <Text className="mt-4 text-slate-400 font-medium">
          Loading Quran...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-lg font-bold text-slate-900 mt-2">Oops!</Text>
        <Text className="text-slate-500 text-center mt-1">{error}</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={displayData}
      keyExtractor={(item) => `${item.number}-${item.startingPage}`}
      initialNumToRender={30}
      maxToRenderPerBatch={30}
      windowSize={15}
      removeClippedSubviews={false}
      renderSectionHeader={({ section }) => (
        <JuzHeader
          juzNumber={section.juzNumber}
          juzStartingPage={section.juzStartingPage}
        />
      )}
      renderItem={({ item }) => (
        <View className="flex-col my-3">
          <SurahRow surah={item} onPress={handlePress} />
        </View>
      )}
    />
  );
}
