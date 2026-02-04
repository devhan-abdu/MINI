import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IFullQuranResponse, Page } from "../features/quran/type";
import { buildPages } from "../features/quran/utils/buildPage";

const STORAGE_KEY = "cached_full_quran_by_page";



export const useGetFullQuran = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pages, setPages] = useState<Page[]>([])


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const cached = await AsyncStorage.getItem(STORAGE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);
          setPages(parsed)
          setLoading(false);       
          return;  
        }

        const response = await fetch(
          "https://api.qurani.ai/gw/qh/v1/quran/quran-uthmani"
        );

        const json: IFullQuranResponse = await response.json();

        if (json.code === 200 && json.data.surahs) {
          const surahList = json.data.surahs
          const pageData = buildPages(surahList)
          setPages(pageData)

          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));
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

  return { pages, loading, error };
};


