import { useState, useEffect } from "react";
import { JuzSection } from "../features/quran/type";
import { getJuz } from "../features/quran/services";
import { useSQLiteContext } from "expo-sqlite";


export const useGetSurahByJuz = () => {
  const [juzs, setJuzs] = useState<JuzSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const db = useSQLiteContext()
   
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

      
        const data = await getJuz(db);

        if (data) {
          setJuzs(data);
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

const renderedSurahs = new Set<number>();

const displayData = juzs.map(juz => {
  const filtered = juz.surahs.filter(surah => {
    if (renderedSurahs.has(surah.number)) return false;

    renderedSurahs.add(surah.number);
    return true;
  });

  const firstSurah = filtered[0];

  return {
    title: `Juz' ${juz.juzNumber}`,
    juzNumber: juz.juzNumber,
    juzStartingPage: firstSurah?.startingPage ?? 0,
    data: filtered,
  };
});

  return { displayData,juzs, loading, error };
};
