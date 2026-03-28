import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useState } from "react";
import { HifzQuestion } from "../types";
import { generateHifzTest } from "../services/test";

export const useHifzTest = (pages: number[]) => {
    const db = useSQLiteContext()
    const [questions, setQuestions] = useState<HifzQuestion[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    

    useEffect(() => {
        const initTest = async () => {
            if (pages.length === 0) {
                setLoading(false)
                return
            }
            
            try {
                setLoading(true)
                console.log("we are herrrrrrrrrrrrr")
                const data = await generateHifzTest(db, pages)
                console.log("are we here")
                setQuestions(data)
            } catch (e) {
               setError("Failed to generate test");
               console.error(e);
            } finally {
                setLoading(false)
            }
        }
        
        initTest()
    }, [pages])

    return { questions, loading, error };
}