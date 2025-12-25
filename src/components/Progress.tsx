import { View, Text } from "react-native";

export default function Progress({
  completionRate,
}: {
  completionRate: number;
}) {
  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-700 font-medium mb-2">Week Completion</Text>
        <Text>{Math.round(completionRate)} %</Text>
      </View>
      <View className={`overflow-hidden rounded-full h-4 bg-gray-400 w-full`}>
        <View
          className="h-full rounded-full"
          style={{
            width: `${completionRate}%`,
            backgroundColor: "#276359",
          }}
        />
      </View>
    </View>
  );
}
