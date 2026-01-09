import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface IinputProps {
  label?: string;
  placeholder?: string;
  value: string;
  setValue: (text: string) => void;
  style?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  leftIcon?: React.ReactNode; 
  [key: string]: any;
}

export default function Input({
  label,
  placeholder,
  value,
  setValue,
  style = "",
  rightIcon,
  onRightIconPress,
  leftIcon,
  ...rest
}: IinputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`mb-4 ${style}`}>
      {label && (
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-2 ml-1">
          {label}
        </Text>
      )}

      <View
        className={`
          w-full
          border-2 
          rounded-[20px]
          px-4
          flex-row
          items-center
          bg-gray-50
          ${isFocused ? "border-primary/40 bg-white" : "border-gray-100"}
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 py-3.5 text-slate-900 font-semibold text-[15px]"
          {...rest}
        />

        {rightIcon && (
          <Pressable onPress={onRightIconPress} className="ml-2">
            {rightIcon}
          </Pressable>
        )}
      </View>
    </View>
  );
}
