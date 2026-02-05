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
            if (pageCache.has(page) || loadingPages.has(page)) return
            loadingPages.add(page)
            
            const query = `
       SELECT 
            p.line_number, 
            p.line_type, 
            p.is_centered,
            p.surah_number,
            (SELECT GROUP_CONCAT(text, '') FROM words WHERE word_index BETWEEN p.first_word_id AND p.last_word_id) as line_text
          FROM pages p
          WHERE p.page_number = ?
          ORDER BY p.line_number ASC
        `
      ;
            const result = await db.getAllAsync(query, [page])

            pageCache.set(page, result)
            loadingPages.delete(page)

            if (!cancelled && page === pageNumber) {
                setLines(result)
            }

        }

        loadPage(pageNumber)
        loadPage(pageNumber - 1)
        loadPage(pageNumber + 1)
        

        return () => {
            cancelled = true
        }
    },[pageNumber,db])

    
    return {lines}
}