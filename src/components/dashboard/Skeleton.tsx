import React from "react";
import { View } from "react-native";

export const CardSkeleton = () => {
  return (
    <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm shadow-slate-200">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1">
          <View className="h-6 w-32 bg-slate-100 rounded-lg mb-2" />
          <View className="h-3 w-40 bg-slate-50 rounded-md" />
        </View>

        <View className="w-10 h-10 bg-slate-100 rounded-full" />
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1 h-12 bg-slate-50 rounded-2xl border border-slate-100" />
        <View className="flex-1 h-12 bg-slate-50 rounded-2xl border border-slate-100" />
      </View>
    </View>
  );
};

export const SectionSkeleton = () => {
    return (
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-xl border border-gray-200 animat-pulse">
        <View className="w-24 h-4 bg-gray-300 rounded-md mb-3" />
        <View className="w-32 h-8 bg-gray-300 rounded-lg mb-5" />

        <View className="w-20 h-4 bg-gray-300 rounded-md mb-2" />
        <View className="w-28 h-6 bg-gray-300 rounded-md mb-4" />

        <View className="w-20 h-4 bg-gray-300 rounded-md mb-2" />
        <View className="w-32 h-6 bg-gray-300 rounded-md mb-4" />

        <View className="flex-row justify-between mt-2">
          <View className="w-20 h-4 bg-gray-300 rounded-md" />
          <View className="w-20 h-4 bg-gray-300 rounded-md" />
          <View className="w-20 h-4 bg-gray-300 rounded-md" />
        </View>
      </View>
    );
}
