import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useFetchQuran } from "@/src/hooks/useFetchQuran";

type DropDataType = {
  number: number;
  englishName: string;
};

interface ISurahDropDownProps {
  surah: number | null;
  setSurah: (value: number) => void;
}

interface ISurahPageDropDown {
  surah: number | null;
  page: number | null;
  setPage: (value: number) => void;
}

const SurahDropdown = ({ surah, setSurah }: ISurahDropDownProps) => {
  const { items, loading, error } = useFetchQuran();

  if (loading) return <Text className="text-center mt-4">Loading...</Text>;
  if (error)
    return <Text className="text-red-500 text-center mt-4">{error}</Text>;

  const renderItemSurah = (item: DropDataType) => (
    <View className="flex-row justify-between items-center p-4">
      <Text className="text-base">{item.englishName}</Text>
      {item.number === surah && (
        <Ionicons name="checkmark" size={20} color="#276359" />
      )}
    </View>
  );

  return (
    <Dropdown
      style={{
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        borderRadius: 8,
      }}
      placeholderStyle={{ fontSize: 16, color: "#6B7280" }}
      selectedTextStyle={{ fontSize: 16 }}
      inputSearchStyle={{ height: 40, fontSize: 16 }}
      iconStyle={{ width: 20, height: 20 }}
      data={items}
      search
      maxHeight={250}
      labelField="englishName"
      valueField="number"
      placeholder="Select Surah"
      searchPlaceholder="Search Surah..."
      value={surah}
      onChange={(item) => setSurah(item.number)}
      renderLeftIcon={() => (
        <Ionicons
          className="mr-2"
          name="book-outline"
          size={20}
          color="#276359"
        />
      )}
      renderItem={renderItemSurah}
    />
  );
};

export const SurahPageDropdown = ({
  surah,
  page,
  setPage,
}: ISurahPageDropDown) => {
  const { items, loading, error } = useFetchQuran();

  if (loading) return <Text className="text-center mt-4">Loading...</Text>;
  if (error)
    return <Text className="text-red-500 text-center mt-4">{error}</Text>;

  const surahPages: { number: number; label: string }[] = useMemo(() => {
    if (!surah) return [];

    const foundSurah = items.find((item) => item.number === surah);
    if (!foundSurah) return [];

    const pages = Array.from(
      { length: foundSurah.endingPage - foundSurah.startingPage + 1 },
      (_, i) => foundSurah.startingPage + i
    );

    return pages.map((page) => ({ number: page, label: `Page ${page}` }));
  }, [surah, items]);

  const renderItemPage = (item: { number: number; label: string }) => (
    <View className="flex-row justify-between items-center p-4">
      <Text className="text-base">{item.label}</Text>
      {item.number === page && (
        <Ionicons name="checkmark" size={20} color="#276359" />
      )}
    </View>
  );

  return (
    <Dropdown
      style={{
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        borderRadius: 8,
      }}
      placeholderStyle={{ fontSize: 16, color: "#6B7280" }}
      selectedTextStyle={{ fontSize: 16 }}
      inputSearchStyle={{ height: 40, fontSize: 16 }}
      iconStyle={{ width: 20, height: 20 }}
      data={surahPages}
      search
      maxHeight={250}
      labelField="label"
      valueField="number"
      placeholder="Select page "
      searchPlaceholder="Search page ..."
      value={page}
      onChange={(item) => setPage(item.number)}
      renderItem={renderItemPage}
    />
  );
};

export default SurahDropdown;
