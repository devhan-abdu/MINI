import { View } from "react-native";
import ScreenWrapper from "./ScreenWrapper";

export const WeeklyMurajaSkeleton = () => {
  return (
    <View className="flex-1 animate-pulse">
      <View className="mt-2 mb-4">
        <View className="w-40 h-6 bg-gray-300 rounded-lg mb-2" />
        <View className="w-28 h-4 bg-gray-300 rounded-lg" />
      </View>

      <View className="bg-white rounded-2xl p-6 mb-6 shadow-xl border border-gray-200">
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

      <View className="mb-8">
        <View className="w-36 h-6 bg-gray-300 rounded-lg mb-4" />

        <View className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <View className="w-24 h-6 bg-gray-300 rounded-md mb-2" />
              <View className="w-16 h-4 bg-gray-300 rounded-md" />
            </View>
            <View className="w-10 h-10 bg-gray-300 rounded-full" />
          </View>

          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between">
              <View className="w-[30%] h-10 bg-gray-300 rounded-lg" />
              <View className="w-[30%] h-10 bg-gray-300 rounded-lg" />
              <View className="w-[30%] h-10 bg-gray-300 rounded-lg" />
            </View>
          </View>
        </View>
      </View>

      <View className="mb-8">
        <View className="w-48 h-6 bg-gray-300 rounded-lg mb-4" />

        <View className="flex-col gap-3">
          <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm h-20" />
          <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm h-20" />
        </View>
      </View>

      <View className="w-full h-12 bg-gray-300 rounded-xl mt-auto mb-6" />
    </View>
  );
};

export const TodaySkeleton = () => {
  return (
    <View className="mb-8">
      <View className="w-36 h-6 bg-gray-300 rounded-lg mb-4" />

      <View className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <View className="w-24 h-6 bg-gray-300 rounded-md mb-2" />
            <View className="w-16 h-4 bg-gray-300 rounded-md" />
          </View>
          <View className="w-10 h-10 bg-gray-300 rounded-full" />
        </View>

        <View className="border-t border-gray-200 pt-4">
          <View className="flex-row justify-between">
            <View className="w-[30%] h-10 bg-gray-300 rounded-lg" />
            <View className="w-[30%] h-10 bg-gray-300 rounded-lg" />
            <View className="w-[30%] h-10 bg-gray-300 rounded-lg" />
          </View>
        </View>
      </View>
    </View>
  );
};

export const UpcomingSkeleton = () => {
  return (
    <View className="mb-8">
      <View className="w-48 h-6 bg-gray-300 rounded-lg mb-4" />

      <View className="flex-col gap-3">
        <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm h-20" />
        <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm h-20" />
      </View>
    </View>
  );
};



export const LogPageSkeleton = () => {
  return (
    <ScreenWrapper>
      <View className="mb-8">
        <View className="w-48 h-8 bg-gray-300 rounded-lg mb-4" />

        <View className="flex-row items-center justify-between px-2 border-t border-gray-200 pt-4">
          <View className="w-24 h-4 bg-gray-300 rounded-md" />
          <View className="h-6 w-px bg-gray-300" />
          <View className="w-16 h-4 bg-gray-300 rounded-md" />
          <View className="h-6 w-px bg-gray-300" />
          <View className="w-20 h-4 bg-gray-300 rounded-md" />
        </View>
      </View>

      <View className="w-24 h-6 bg-gray-300 rounded-md mb-4" />

      <View className="flex-row bg-gray-100 rounded-xl p-1">
        <View className="flex-1 h-10 bg-gray-300 rounded-lg mx-1" />
        <View className="flex-1 h-10 bg-gray-300 rounded-lg mx-1" />
        <View className="flex-1 h-10 bg-gray-300 rounded-lg mx-1" />
      </View>

      <View className="mt-8 mb-12 gap-6">
        <View className="gap-2">
          <View className="w-32 h-4 bg-gray-300 rounded-md" />
          <View className="w-full h-11 bg-gray-300 rounded-lg" />
        </View>

        <View className="gap-2">
          <View className="w-40 h-4 bg-gray-300 rounded-md" />
          <View className="w-full h-11 bg-gray-300 rounded-lg" />
        </View>

        <View className="gap-2">
          <View className="w-24 h-4 bg-gray-300 rounded-md" />
          <View className="w-full h-11 bg-gray-300 rounded-lg" />
        </View>

        <View className="gap-2">
          <View className="w-20 h-4 bg-gray-300 rounded-md" />
          <View className="w-full h-24 bg-gray-300 rounded-lg" />
        </View>
      </View>

      <View className="h-12 w-full bg-gray-300 rounded-xl mb-8" />
    </ScreenWrapper>
  );
};

