import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
  surahName?: string;
  pages?: string;
}

export default function HifzOverViewCard({
  progress = 0,
  size = 125,
  strokeWidth = 10,
  surahName = "Al-Baqarah",
  pages = "12-15",
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

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
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#ffffff"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-white/60 font-bold text-[8px] uppercase tracking-tighter">
          Surah
        </Text>

        <Text
          numberOfLines={1}
          className="text-white text-sm font-black text-center px-1"
        >
          {surahName}
        </Text>

        <Text className="text-white/70 text-[10px] font-semibold mt-0.5">
          {Math.round(progress)}%
        </Text>

        <View className="mt-1 bg-white/20 px-2 py-0.5 rounded-full border border-white/10">
          <Text className="text-white font-bold text-[9px]">Pg {pages}</Text>
        </View>
      </View>
    </View>
  );
}
