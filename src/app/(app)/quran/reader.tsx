import { QuranPage } from "@/src/features/quran/components/QuranPage";
import { useGetFullQuran } from "@/src/hooks/useGetFullQuran";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuranScreen() {
  const { pages, loading } = useGetFullQuran();
  const { page } = useLocalSearchParams<{ page?: string }>();
  const navigation = useNavigation();
  const listRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  const [showHeader, setShowHeader] = useState(false);

  const insets = useSafeAreaInsets();

  const targetPage = Number(page || 1);

  const initialIndex = useMemo(() => {
    return pages.findIndex((p) => p.pageNumber === targetPage);
  }, [pages, targetPage]);

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

  if (loading || !pages.length || initialIndex === -1) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#276359" />
        <Text className="mt-3 text-slate-400">Loading Quran…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 ">
      {/* <Pressable className="flex-1" onPress={() => setShowHeader(!showHeader)}> */}
      <FlatList
        ref={listRef}
        data={pages}
        horizontal
        pagingEnabled
        inverted
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
        initialScrollIndex={initialIndex}
        windowSize={7}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        renderItem={({ item }) => <QuranPage page={item} />}
        keyExtractor={(item) => item.pageNumber.toString()}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      {/* </Pressable> */}
      {/* {showHeader && (
        <View
          className="absolute top-0 left-0 right-0 z-50
                     bg-white/95 px-4 pt-12 pb-3"
        >
          <Text className="text-center text-base font-semibold">Quran</Text>
          <Text className="text-center text-xs text-gray-500">
            Page {targetPage}
          </Text>
        </View>
      )} */}
    </View>
  );
}
