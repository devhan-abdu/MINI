import { useState, useEffect } from "react";
import { ISurah } from "../types";
import { getSurah } from "../features/quran/services";
import { useSQLiteContext } from "expo-sqlite";


export const useLoadSurahData = () => {
  const [items, setItems] = useState<ISurah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const db = useSQLiteContext()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getSurah(db);

        if (data) {
          setItems(data);
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
