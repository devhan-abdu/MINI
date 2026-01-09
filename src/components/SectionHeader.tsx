import { View, Text } from "react-native";

interface SectionHeaderProps {
  title: string; 
  badge?: string; 
  rightElement?: React.ReactNode; 
}

export const SectionHeader = ({
  title,
  badge,
  rightElement,
}: SectionHeaderProps) => (
  <View className="flex-row justify-between items-end mb-5 px-1">
    <View className="flex-1">
      <Text className="text-2xl font-black text-gray-900 tracking-tight">
        {title}
      </Text>
    </View>

    {badge ? (
      <View className="bg-primary/10 px-3 py-1.5 rounded-full">
        <Text className="text-primary font-bold text-[10px] uppercase tracking-wider">
          {badge}
        </Text>
      </View>
    ) : (
      rightElement
    )}
  </View>
);
