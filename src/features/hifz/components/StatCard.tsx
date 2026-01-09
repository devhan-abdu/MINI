import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  type?: "success" | "danger" | "info" | "warning";
  icon: keyof typeof Ionicons.glyphMap;
}

export default function StatCard({
  title,
  value,
  unit,
  type = "success",
  icon,
}: StatCardProps) {
  const theme = {
    success: {
      bg: "bg-emerald-50",
      icon: "#059669",
      border: "border-emerald-100/50",
    },
    danger: { bg: "bg-rose-50", icon: "#e11d48", border: "border-rose-100/50" },
    info: { bg: "bg-blue-50", icon: "#059669", border: "border-blue-100/50" },
    warning: {
      bg: "bg-amber-50",
      icon: "#059669",
      border: "border-amber-100/50",
    },
  }[type];

  return (
    <View className="bg-white p-4 pt-2 rounded-xl shadow-sm border border-gray-100 w-[48%] mb-4 relative overflow-hidden">
      <View
        className={`absolute -right-2 -top-2 w-12 h-12 rounded-full ${theme.bg} opacity-20`}
      />

      <View className="flex-row items-center justify-between mb-3">
        <View
          className={`w-10 h-10 rounded-2xl items-center justify-center ${theme.border}`}
        >
          <Ionicons name={icon} size={20} color={theme.icon} />
        </View>

        <Text className="text-gray-300 text-[10px] font-black uppercase tracking-widest">
          {unit}
        </Text>
      </View>

      <View>
        <Text className="text-2xl font-black text-gray-900 tracking-tight">
          {value}
        </Text>
        <Text className="text-gray-400 text-[11px] font-bold uppercase mt-0.5">
          {title}
        </Text>
      </View>
    </View>
  );
}
