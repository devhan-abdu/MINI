import { useQuranPage } from "@/src/hooks/useQuranPage";
import { Text, View } from "react-native";

interface QuranPageprops {
  pageNumber: number,
  pageWidth: number,
  pageHeight: number
}

export function QuranPage({ pageNumber, pageWidth, pageHeight }: QuranPageprops) {
  const { lines } = useQuranPage(pageNumber)
  const  LINE_HEIGHT = pageHeight /15
  
  
  return (
    <View
      style={{ width: pageWidth, height: pageHeight, paddingHorizontal: 15 }}
    >
      {lines?.map((line, index) => (
        <View
          key={index}
          className="justify-center items-center w-full"
          style={{ height: LINE_HEIGHT }}
        >
          {line.line_type === "surah_name" ?
            <View className="bg-slate-100 px-4 py-1 rounded-md">
              <Text
                className="text-slate-900" 
                style={{ fontFamily: "Thuluth", fontSize: LINE_HEIGHT * 0.5 }}
              >
                {line.surah_name}
              </Text>
            </View>
          : <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="text-black w-full" 
              style={{
                fontFamily: "UthmanicHafs",
                fontSize: LINE_HEIGHT * 0.7,
                textAlign: line.is_centered ? "center" : "justify",
              }}
            >
              {line.line_text}
            </Text>
          }
        </View>
      ))}
    </View>
  );
}