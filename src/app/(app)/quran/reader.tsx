import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, useWindowDimensions, View } from "react-native";
import { getPageImage, prefetchPages } from "@/src/features/quran/services";
import { QuranPage } from "@/src/features/quran/components/QuranPage";
import { useLocalSearchParams } from "expo-router";


const ALL_PAGES = Array.from({ length: 604 }, (_, i) => i + 1);

export default function QuranScreen() {
  const { width, height } = useWindowDimensions();
  const { page } = useLocalSearchParams<{ page?: string }>();
  const listRef = useRef<FlatList>(null);

  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [images, setImages] = useState<Record<number, string>>({});
  const cache = useRef<Map<number, string>>(new Map());

const RANGE = 4;

  useEffect(() => {
    const load = async () => {
      const updates: Record<number, string> = {};

      const start = Math.max(1, currentPage - RANGE);
      const end = Math.min(604, currentPage + RANGE);

      await Promise.all(
        Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
          async (p) => {
            if (cache.current.has(p)) {
              updates[p] = cache.current.get(p)!;
            } else {
              const uri = await getPageImage(p);
              if (uri) {
                cache.current.set(p, uri);
                updates[p] = uri;
              }
            }
          },
        ),
      );

      setImages((prev) => ({ ...prev, ...updates }));
      prefetchPages(currentPage + 1);
      prefetchPages(currentPage + 2);;
    };

    load();
  }, [currentPage]);

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    const page = ALL_PAGES[index];

    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: number }) => {
      const uri = images[item];

      return (
        <QuranPage
          pageNumber={item}
          uri={uri}
          pageWidth={width}
          pageHeight={height}
        />
      );
    },
    [images, width, height],
  );

  if (!images[currentPage]) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={ALL_PAGES}
      horizontal
      pagingEnabled
      inverted
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={currentPage - 1}
      getItemLayout={(_, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      windowSize={5}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
      onMomentumScrollEnd={onScrollEnd}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index: info.index,
            animated: false,
          });
        }, 100);
      }}
      keyExtractor={(item) => item.toString()}
      renderItem={renderItem}
    />
  );
}
