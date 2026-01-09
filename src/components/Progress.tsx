import { View, Text } from "react-native";

export default function Progress({
  completionRate,
}: {
  completionRate: number;
}) {
  return (
    <View className="mb-6 bg-primary/5 p-4 rounded-[24px] border border-primary/10">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-primary-900 font-black text-sm uppercase tracking-tighter">
            Week Completion
          </Text>
          <Text className="text-primary/50 text-[10px] font-bold">
            Your weekly goal progress
          </Text>
        </View>
        <Text className="text-primary font-black text-xl">
          {Math.round(completionRate)}%
        </Text>
      </View>
      <View className="overflow-hidden rounded-full h-3 bg-primary/10 w-full">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${completionRate}%` }}
        />
      </View>
    </View>
  );
}
