import { useState, useEffect } from "react";
import { ISurah } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "cached_surah_data";

export const useLoadSurahData = () => {
  const [items, setItems] = useState<ISurah[]>([]);
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
          setItems(parsed);        
          setLoading(false);       
          return;  
        }

        const response = await fetch(
          "https://api.quranhub.com/v1/surah/?revelationOrder=false"
        );

        const data = await response.json();

        if (data.code === 200 && data.data) {
          setItems(data.data);

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

  return { items, loading, error };
};
