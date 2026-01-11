import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable,Text } from "react-native";

export const StatusButton = ({
  label,
  icon,
  activeColor,
  isActive,
  onPress,
  loading,
}: any) => (
  <Pressable
    onPress={onPress}
    disabled={loading}
    className={`flex-1 flex-row items-center justify-center py-3.5 rounded-2xl border ${
      isActive
        ? `${activeColor} border-transparent shadow-md shadow-slate-200`
        : "bg-white border-slate-100"
    } active:scale-[0.97] transition-all`}
  >
    {loading && isActive ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <>
        <Ionicons
          name={icon as any}
          size={15}
          color={isActive ? "white" : "#94a3b8"}
        />
        <Text
          className={`ml-2 text-[10px] font-black uppercase tracking-wider ${
            isActive ? "text-white" : "text-slate-500"
          }`}
        >
          {label}
        </Text>
      </>
    )}
  </Pressable>
);