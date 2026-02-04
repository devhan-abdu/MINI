import { Dimensions, Text,View } from "react-native";
import { Page } from "../type";
import { SurahHeader } from "./SurahHeader";

export function QuranPage({ page }: { page: Page}) {
  const { width } = Dimensions.get("window")
  
  
    if (!page || !page.sections) {
      return null;
    }

  return (
    <View style={{ width: width }} className="px-1  py-10 ">
      <View className="flex-row items-center justify-between gap-4 py-6 px-4">
        <Text className="text-gray-600">Surah {page.surahName}</Text>
        <Text className="text-gray-600">Juz' {page.juz}</Text>
      </View>

      {page.sections.map((section, index) => (
        <View key={index} className="flex-col items-center justify-center ">
          {section.header && (
            <>
              <SurahHeader surahName={section.header.surahName} />
              {section.header.showBismillah && (
                <Text
                  style={{
                    fontFamily: "UthmanicHafs",
                    fontSize: 25,
                    lineHeight: 52,
                    textAlign: "center",
                    writingDirection: "rtl",
                  }}
                >
                  بِســــمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                </Text>
              )}
            </>
          )}

          <Text key={index}>
            {section.ayahs.map((a, idx) => (
              <Text
                key={idx}
                style={{
                  fontFamily: "meQuran",
                  fontSize: 22,
                  lineHeight: 48,
                  textAlign: "center",
                  writingDirection: "rtl",
                }}
              >
                {a.text}{" "}
                <Text style={{ color: "#276359", fontFamily: "UthmanicHafs" }}>
                  {a.ayahNumber}
                </Text>{" "}
              </Text>
            ))}
          </Text>
        </View>
      ))}
      <Text className="text-gray-600 mt-auto mb-4 px-4">{page.pageNumber}</Text>
    </View>
  );
}


