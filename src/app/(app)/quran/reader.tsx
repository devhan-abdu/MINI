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
import { FlashList, FlashListRef } from "@shopify/flash-list";


const ALL_PAGES = Array.from({ length: 604 }, (_, i) => i + 1).reverse();

export default function QuranScreen() {
  const { pages, loading } = useGetFullQuran();
  const { page } = useLocalSearchParams<{ page?: string }>();
  const navigation = useNavigation();
  const listRef = useRef<FlashListRef<number>>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets()

  const [showHeader, setShowHeader] = useState(false);

const HEADER_HEIGHT = 60;
const AVAILABLE_HEIGHT = height - insets.top - insets.bottom - HEADER_HEIGHT;
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
   <View className="flex-1 bg-gray-50 items-center justify-center px-6">
     {/* Temporary in-progress screen while Quran reader is under development */}
     <View className="items-center justify-center space-y-4">
       <ActivityIndicator size="large" color="#276359" />
       <Text className="text-xl font-semibold text-gray-800 text-center">
         Quran Reader is in progress
       </Text>
       {/* <Text className="text-gray-500 text-center">
         Pages and navigation will appear soon. Thank you for your patience.
       </Text> */}
     </View>
     {/* Optional placeholder for where the FlashList will go later */}
     {/* <Pressable className="flex-1" onPress={() => setShowHeader(!showHeader)}>
        <FlashList
          ref={listRef}
          data={ALL_PAGES}
          renderItem={({ item }) => <QuranPage pageNumber={item} pageWidth={width} pageHeight={AVAILABLE_HEIGHT} />}
          horizontal
          pagingEnabled
          keyExtractor={(item) => item.toString()}  
          initialScrollIndex={initialIndex}
          drawDistance={width * 2}
          onEndReachedThreshold={0.5}
        />
      </Pressable> */}
   </View>
 );

}
