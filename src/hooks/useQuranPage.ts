import { useState, useEffect } from "react"
import { useSQLiteContext } from "expo-sqlite"

const pageCache = new Map<number, any[]>()
const loadingPages = new Set<number>()

export const useQuranPage = (pageNumber: number) => {
    const db = useSQLiteContext();
    const [lines, setLines] = useState<any[]>(() => pageCache.get(pageNumber) ?? [])
    

    useEffect(() => {
        let cancelled = false

        async function loadPage(page: number) {
            if (pageCache.has(page) || loadingPages.has(page) || page < 1 || page > 604) return
            
            loadingPages.add(page)


            try {
                
                const query = `
                        SELECT 
                        p.*,
                        s.name_simple AS surah_english_name,
                        s.name_arabic AS surah_arebic_name,
                        (
                            SELECT GROUP_CONCAT(text, ' ')
                            FROM words
                            WHERE id BETWEEN p.first_word_id AND p.last_word_id
                            ORDER BY id ASC
                        ) AS line_text
                        FROM pages p
                        LEFT JOIN surah_names s ON p.surah_number = s.id
                        WHERE p.page_number = ?
                        ORDER BY p.line_number ASC
                        `;


                const result = await db.getAllAsync(query, [page])
                pageCache.set(page, result)

                if (!cancelled && page === pageNumber) {
                    setLines(result)
                }
            } catch (e) {
                console.error("Query failed", e)
            } finally {
                loadingPages.delete(page)
            }
        }

        if (pageCache.has(pageNumber)) {
            setLines(pageCache.get(pageNumber)!);
        } else {
            loadPage(pageNumber)
        }

        const timer = setTimeout(() => {
            loadPage(pageNumber - 1);
            loadPage(pageNumber + 1);
        }, 1000);
            
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [pageNumber, db])
          

      return {lines , isLoading: lines.length ===0 } 
  
    }