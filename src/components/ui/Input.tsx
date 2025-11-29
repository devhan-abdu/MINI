
import { Pressable, Text, TextInput, View } from "react-native";

interface IinputProps {
  label?: string;
  placeholder?: string;
  value: string;
  setValue: (text: string) => void;
  style?: string;
  rightIcon?: React.ReactNode;  
  onRightIconPress?: () => void; 
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
  ...rest
}: IinputProps) {
  return (
    <View className={`mb-4 ${style}`}>
      {label && (
        <Text className="text-gray-900 font-semibold mb-2.5">
          {label}
        </Text>
      )}

      <View
        className="
          w-full
          border-2 
          border-gray-300
          rounded-lg
          px-3
          py-1
          flex-row
          items-center
          bg-white
        "
      >
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor="#8c8d8fff"
          className="flex-1 text-black"
          {...rest}
        />

        {rightIcon && (
          <Pressable onPress={onRightIconPress}>
            {rightIcon}
          </Pressable>
        )}
      </View>
    </View>
  );
}
