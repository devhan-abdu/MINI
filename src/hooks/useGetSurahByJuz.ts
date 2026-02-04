import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { JuzSection } from "../features/quran/type";

const STORAGE_KEY = "cached_surahs_by_juz";

export const useGetSurahByJuz = () => {
  const [juzs, setJuzs] = useState<JuzSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");


        const cached = await AsyncStorage.getItem(STORAGE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);
          setJuzs(parsed);        
          setLoading(false);       
          return;  
        }

        const response = await fetch(
          "https://api.qurani.ai/gw/qh/v1/surah/byJuz"
        );

        const data = await response.json();

        if (data.code === 200 && data.data) {
          setJuzs(data.data);

          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        } else {
          setError("Failed to fetch surah data");
        }
      } catch (err) {
        setError(String(err) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  let renderedSurahs = new Set<number>();
  const displayData = juzs.map(juz => {
    const filteredSurahs = [];
    
    for (const surah of juz.surahs) {
      if (!renderedSurahs.has(surah.number)) {
        renderedSurahs.add(surah.number)
        filteredSurahs.push(surah)
      }
    }

    const firstSurah = juz.surahs && juz.surahs.length > 0 ? juz.surahs[0] : null;
    return {
        title: `Juz' ${juz.juzNumber}`,
        juzNumber: juz.juzNumber,
        juzStartingPage: firstSurah ? firstSurah.startingPage : 0, 
        data: filteredSurahs
    };
});

  return { displayData,juzs, loading, error };
};
