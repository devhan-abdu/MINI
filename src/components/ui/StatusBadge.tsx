import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Status = "completed" | "pending" | "missed" | "partial";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: Status) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-50",
          text: "text-primary",
          border: "border-green-200",
          icon: "checkmark-circle",
          iconColor: "#666",
        };

      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-800",
          border: "border-amber-200",
          icon: "checkmark-circle",
          iconColor: "#666",
        };

      case "missed":
        return {
          bg: "bg-red-50",
          text: "text-red-800",
          border: "border-red-200",
          icon: "checkmark-circle",
          iconColor: "#666",
        };

      case "partial":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: "checkmark-circle",
          iconColor: "#666",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: "checkmark-circle",
          iconColor: "#666",
        };
    }
  };

  const style = getStatusStyle(status);

  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-1.5 border ${style.bg} ${style.border} `}
    >
      <Ionicons
        name={style.icon as any}
        size={14}
        color={style.iconColor}
        style={{ marginRight: 4 }}
      />

      <Text className={`font-medium text-sm ${style.text}`}>{status}</Text>
    </View>
  );
}
