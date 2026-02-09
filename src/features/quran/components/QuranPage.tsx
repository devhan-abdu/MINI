import { useQuranPage } from "@/src/hooks/useQuranPage";
import { Text, View } from "react-native";

interface QuranPageprops {
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
}

export function QuranPage({
  pageNumber,
  pageWidth,
  pageHeight,
}: QuranPageprops) {
  const { lines } = useQuranPage(pageNumber);

  const HEADER_HEIGHT = pageHeight * 0.08;
  const FOOTER_HEIGHT = pageHeight * 0.06;

  const MUSHAF_GRID_HEIGHT = pageHeight - HEADER_HEIGHT - FOOTER_HEIGHT;

  const LINE_HEIGHT = MUSHAF_GRID_HEIGHT / 15;

  return (
    <View
      style={{ width: pageWidth, height: pageHeight, backgroundColor: "#fff" }}
    >
      <View
        style={{
          height: HEADER_HEIGHT,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingHorizontal: 20,
          
        }}
      >
        <Text style={{ fontSize: 14, color: "#666" }}>
          Al-Baqarah
        </Text>
        <Text style={{ fontSize: 14, color: "#666" }}>
          Juz' 1
        </Text>
      </View>

      <View style={{ height: MUSHAF_GRID_HEIGHT }}  className="flex-1 items-center justify-center mt-4">
        {lines?.map((line, index) => (
          <View
            key={index}
            style={{
              height: LINE_HEIGHT,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 6,
            }}
          >
            {line.line_type === "surah_name" ?
              <View
                style={{
                  height: "85%",
                  width: "100%",
                  backgroundColor: "#f9fafb",
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 4,
                  justifyContent: "center",
                  marginBottom: 6
                }}
              >
                <Text
                  style={{
                    fontFamily: "UthmanicHafs",
                    fontSize: LINE_HEIGHT * 0.45,
                    textAlign: "center",
                  }}
                >
                  سورة {line.surah_arabic_name}
                </Text>
              </View>
            : <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={{
                  fontFamily: "UthmanicHafs",
                  fontSize: LINE_HEIGHT * 0.9,
                  textAlign: line.is_centered ? "center" : "center",
                  writingDirection: "rtl",
                  color: "#000",
                  lineHeight: undefined,
                  includeFontPadding: false,
                  textAlignVertical: "center",
                }}
              >
                {line.line_type === "basmallah" ?
                  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                : line.line_text}{" "}
              </Text>
            }
          </View>
        ))}
      </View>

      <View
        style={{
          height: FOOTER_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{pageNumber}</Text>
      </View>
    </View>
  );
}