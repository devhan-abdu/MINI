import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
  surahName?: string;
  pages?: string;
  variant?: "primary" | "white"; 
}

export default function HifzOverViewCard({
  progress = 0,
  size = 125,
  strokeWidth = 10,
  surahName = "Al-Baqarah",
  pages = "12-15",
  variant = "primary", 
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  const isWhite = variant === "white";

  const trackColor = isWhite ? "#f1f5f9" : "rgba(255, 255, 255, 0.2)"; 
  const progressColor = isWhite ? "#276359" : "#ffffff"; 

  const labelColor = isWhite ? "text-slate-400" : "text-white/60";
  const mainTextColor = isWhite ? "text-slate-900" : "text-white";
  const badgeBg = isWhite ? "bg-slate-100" : "bg-white/20";
  const badgeText = isWhite ? "text-slate-600" : "text-white";
  const badgeBorder = isWhite ? "border-slate-200" : "border-white/10";

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <View className="absolute inset-0 items-center justify-center">
        <Text
          className={`${labelColor} font-black text-[8px] uppercase tracking-widest`}
        >
          Surah
        </Text>

        <Text
          numberOfLines={1}
          className={`${mainTextColor} text-sm font-black text-center px-1 tracking-tighter`}
        >
          {surahName}
        </Text>

        <Text
          className={`${
            isWhite ? "text-primary" : "text-white/80"
          } text-[10px] font-black mt-0.5`}
        >
          {Math.round(progress)}%
        </Text>

        <View
          className={`mt-1.5 ${badgeBg} px-2 py-0.5 rounded-full border ${badgeBorder}`}
        >
          <Text className={`${badgeText} font-black text-[8px]`}>
            Pg {pages}
          </Text>
        </View>
      </View>
    </View>
  );
}
