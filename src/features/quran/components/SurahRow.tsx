import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Surah } from "../type";

interface SurahRowProps {
  surah: Surah;
  onPress: (surah: Surah) => void;
}

export const SurahRow = memo(({ surah, onPress }: SurahRowProps) => {
  return (
    <Pressable onPress={() => onPress(surah)} className=" px-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-1 flex-row items-center gap-4">
          <Text className="text-xl">{surah.number}</Text>
          <View>
            <Text className="text-lg  text-gray-900">{surah.englishName}</Text>
            <Text className="text-sm text-gray-500">
              {surah.numberOfAyahs} Ayahs - {surah.revelationType}
            </Text>
          </View>
        </View>
        <Text className="text-lg text-gray-400">{surah.startingPage}</Text>
      </View>
    </Pressable>
  );
});
