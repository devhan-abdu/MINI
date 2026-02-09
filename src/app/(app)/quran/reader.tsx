import { QuranPage } from "@/src/features/quran/components/QuranPage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const ALL_PAGES = Array.from({ length: 604 }, (_, i) => i + 1);

export default function QuranScreen() {
  const { page } = useLocalSearchParams<{ page?: string }>();
  const navigation = useNavigation();
  const listRef = useRef<FlatList>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets()



const AVAILABLE_HEIGHT = height;
  const initialIndex = Number(page || 1) + 1;



  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
      });
    };
  }, []);

  if (initialIndex === -1) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#276359" />
        <Text className="mt-3 text-slate-400">Loading Quran…</Text>
      </View>
    );
  }

  return (
    <FlatList
      className="bg-white"
        data={ALL_PAGES}
        ref={listRef}
        horizontal
        inverted
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <QuranPage
            pageNumber={item}
            pageWidth={width}
            pageHeight={AVAILABLE_HEIGHT}
          />
        )}
      />
  );

}
