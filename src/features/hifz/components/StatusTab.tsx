import { Ionicons } from "@expo/vector-icons";
import { Pressable,Text } from "react-native";

type StatusTabType = {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
};

export function StatusTab({ label, icon, active, onPress }: StatusTabType) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center p-2 rounded-2xl w-[31%] border-2 ${
        active ? "bg-white border-[#2D6A4F]" : "bg-gray-100 border-transparent"
      }`}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={active ? "#2D6A4F" : "#9CA3AF"}
      />
      <Text
        className={`font-bold mt-2 ${
          active ? "text-[#2D6A4F]" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
