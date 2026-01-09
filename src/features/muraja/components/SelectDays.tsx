import { Pressable, Text, View } from "react-native";

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
}

const dayObjects = [
  { name: "Mon", offset: 0 },
  { name: "Tue", offset: 1 },
  { name: "Wed", offset: 2 },
  { name: "Thu", offset: 3 },
  { name: "Fri", offset: 4 },
  { name: "Sat", offset: 5 },
  { name: "Sun", offset: 6 },
];

export default function SelectDays({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-x-2 gap-y-2">
      {dayObjects.map((day) => {
        const isSelected = value.includes(day.offset);

        const handlePress = () => {
          if (isSelected) {
            onChange(value.filter((v) => v !== day.offset));
          } else {
            onChange([...value, day.offset]);
          }
        };
        return (
          <Pressable
            key={day.offset}
            onPress={handlePress}
            className={` flex-1 min-w-[64px] h-10 rounded-full border bg-white
                     ${
                       isSelected
                         ? "border-green-100 bg-green-400 text-green-900"
                         : "border-gray-200 bg-white text-black"
                     }
                   items-center justify-center
                active:opacity-90
                `}
            style={{
              shadowColor: isSelected ? "#276359" : "#000",
              shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
              shadowOpacity: isSelected ? 0.1 : 0,
              shadowRadius: isSelected ? 4 : 0,
              elevation: isSelected ? 3 : 0,
            }}
          >
            <Text
              className={`font-semibold text-base ${
                isSelected ? "text-primary" : "text-gray-700"
              }`}
            >
              {day.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
