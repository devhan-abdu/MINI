import { View, Text, Image } from "react-native";

export function SurahHeader({ surahName }: { surahName: string }) {
  return (
    <View
      className="my-2  mx-4 w-full h-12 flex-row items-center overflow-hidden"
      style={{
        borderWidth: 1.5,
        borderColor: "#276359",
        borderRadius: 14,
        borderStyle:'dashed'
      }}
    >
      {/* <View className="flex-1 h-full">
        <Image
          source={require("@/assets/images/decor.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          tintColor="#276359"
        />
      </View> */}

      <View className="px-2 h-full w-full flex-row justify-center items-center">
        <Text
          style={{
            fontFamily: "Thuluth",
            color: "#1f2937",
            fontSize: 24,
            includeFontPadding: false,
            textAlignVertical: "center",
          }}
          className=""
        >
          {surahName}
        </Text>
      </View>

      {/* <View className="flex-1 h-full">
        <Image
          source={require("@/assets/images/decor.png")}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
          tintColor="#276359"
        />
      </View> */}
    </View>
  );
}
