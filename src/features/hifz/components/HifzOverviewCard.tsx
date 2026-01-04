import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export default function HifzOverViewCard({
  progress,
  size = 120,
  strokeWidth = 10,
}: Props) {
  const surah = "Al-Baqarah";
  const startPage = 12;
  const endpage = 15;
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
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0b6623"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <View className="absolute inset-0 items-center justify-center pt-2">
        <Text className="text-gray-400 font-bold text-[10px] uppercase">
          Surah
        </Text>
        <Text className="text-xl font-black text-gray-900 text-center leading-6">
          Al-Baqarah
        </Text>
        <View className="mt-2 bg-green-500/10 px-2 py-0.5 rounded-full">
          <Text className="text-green-600 font-bold text-[10px]">
            Pg {startPage}-{endpage}
          </Text>
        </View>
      </View>
    </View>
  );
}
