import React from "react";
import { View } from "react-native";

export default function PlanFormSkeleton() {
  return (
    <View className="px-4 pt-4">
      <View className="mb-6 h-14 w-full bg-gray-200 rounded-full animate-pulse" />

      <View className="mb-8 h-32 w-full bg-gray-100 rounded-[32px] animate-pulse" />

      <View className="mb-6">
        <View className="w-24 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
        <View className="h-14 w-full bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
      </View>

      <View className="mb-6">
        <View className="w-32 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
        <View className="h-14 w-full bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
      </View>

      <View className="flex-row gap-4 mb-8">
        <View className="flex-1">
          <View className="w-20 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
          <View className="h-14 w-full bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
        </View>
        <View className="flex-1">
          <View className="w-20 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
          <View className="h-14 w-full bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
        </View>
      </View>

      <View className="mb-10">
        <View className="w-28 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
        <View className="flex-row justify-between mt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <View
              key={i}
              className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
            />
          ))}
        </View>
      </View>

      <View className="h-16 w-full bg-green-900/20 rounded-2xl animate-pulse" />
    </View>
  );
}





const SkeletonRect = ({ className }: { className?: string }) => (
  <View className={`bg-gray-200 animate-pulse ${className}`} />
);

export function HifzTrackerSkeleton() {
  return (
    <View className="flex-1 bg-white px-4 pt-4">
     

      <View className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 mb-8">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-1">
            <SkeletonRect className="w-24 h-3 rounded-full mb-3" />
            <SkeletonRect className="w-36 h-8 rounded-xl mb-4" />
            <SkeletonRect className="w-28 h-6 rounded-full" />
          </View>
          <View className="w-[120px] h-[120px] rounded-full border-[10px] border-gray-200 items-center justify-center">
            <SkeletonRect className="w-10 h-6 rounded-md" />
          </View>
        </View>

        <View className="flex-row gap-4">
          <SkeletonRect className="flex-1 h-20 rounded-2xl" />
          <SkeletonRect className="flex-1 h-20 rounded-2xl" />
        </View>
      </View>

      <View className="mb-10">
        <SkeletonRect className="w-44 h-6 rounded-lg mb-4" />
        <View className="flex-row justify-between bg-gray-50/50 p-4 rounded-3xl">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <View key={i} className="items-center">
              <SkeletonRect className="w-9 h-9 rounded-full mb-2" />
              <SkeletonRect className="w-6 h-3 rounded-full" />
            </View>
          ))}
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonRect key={i} className="w-[48%] h-24 rounded-3xl mb-4" />
        ))}
      </View>

      <SkeletonRect className="w-full h-16 rounded-2xl mt-4" />

      <View className="mt-10 p-6 rounded-[32px] border border-dashed border-gray-200">
        <SkeletonRect className="w-6 h-6 rounded-full mb-3" />
        <SkeletonRect className="w-full h-4 rounded-full mb-2" />
        <SkeletonRect className="w-3/4 h-4 rounded-full" />
      </View>
    </View>
  );
}
