import { HifzQuestion } from "../types";

const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

export const generateHifzTest = async (db: any, completedPages: number[]) => {
  if (!db) throw new Error("Database connection not provided");
  if (!completedPages || completedPages.length === 0) return [];

  try {
    const pageCount = completedPages.length;
    const totalQuestions = pageCount >= 30 ? 15 : pageCount > 20 ? 12 : pageCount > 10 ? 10 : 6;
    const questionsPerType = Math.floor(totalQuestions / 2);
    const queue: HifzQuestion[] = [];

    const getRandomPage = () => completedPages[Math.floor(Math.random() * completedPages.length)];

    for (let i = 0; i < questionsPerType; i++) {
        
        try {
            const page = getRandomPage();
            
            const wordRange = await db.getFirstAsync(
                `SELECT first_word_id, last_word_id FROM pages WHERE page_number = ?`, 
                [page]
            );
          console.log(3,"console looo")

            if (!wordRange) continue;

            const randomId = Math.floor(Math.random() * (wordRange.last_word_id - wordRange.first_word_id)) + wordRange.first_word_id;

          console.log(1,"db call")
            const ayahData = await db.getFirstAsync(`
                SELECT
                    (SELECT GROUP_CONCAT(text, ' ') FROM words WHERE surah=current.surah AND ayah = current.ayah - 1) as prev_ayah,
                    (SELECT GROUP_CONCAT(text, ' ') FROM words WHERE surah = current.surah AND ayah = current.ayah) as current_ayah,
                    (SELECT GROUP_CONCAT(text, ' ') FROM words WHERE surah = current.surah AND ayah = current.ayah + 1) as next_ayah,
                    current.surah, current.ayah
                FROM words current
                WHERE current.id = ?`, 
                [randomId]
            );
          console.log(2, "db call 2")
          console.log(ayahData, "is ayaadata exist")

            if (ayahData) {
                queue.push({
                    type: 'SEQUENCE',
                    question: ayahData.current_ayah,
                    answer: {
                        previous: ayahData.prev_ayah || "Start of Surah",
                        next: ayahData.next_ayah || "End of Surah"
                    },
                    hint: `Surah ${ayahData.surah}:${ayahData.ayah}`
                });
            }
        } catch (innerError) {
            console.warn("Failed to generate a Sequence question, skipping...", innerError);
        }
    }

    for (let i = 0; i < questionsPerType; i++) {
        try {
            const page = getRandomPage();
            const boundaryData = await db.getFirstAsync(`
                SELECT
                    (SELECT GROUP_CONCAT(text, ' ') FROM words WHERE (surah, ayah) = (SELECT surah, ayah FROM words WHERE id = p.first_word_id)) AS start_ayah,
                    (SELECT GROUP_CONCAT(text, ' ') FROM words WHERE (surah, ayah) = (SELECT surah, ayah FROM words WHERE id = p.last_word_id)) AS end_ayah,
                    (SELECT GROUP_CONCAT(text, ' ') FROM words w2 WHERE w2.surah = mid.surah AND w2.ayah = mid.ayah) AS middle_ayah
                FROM pages p 
                LEFT JOIN (
                    SELECT surah, ayah FROM words
                    WHERE id BETWEEN (SELECT first_word_id FROM pages WHERE page_number = ?) AND (SELECT last_word_id FROM pages WHERE page_number = ?)
                    AND (surah, ayah) != (SELECT surah, ayah FROM words WHERE id = (SELECT first_word_id FROM pages WHERE page_number = ?)) 
                    AND (surah, ayah) != (SELECT surah, ayah FROM words WHERE id = (SELECT last_word_id FROM pages WHERE page_number = ?)) 
                    GROUP BY surah, ayah
                    ORDER BY RANDOM()
                    LIMIT 1              
                ) as mid ON 1=1
                WHERE p.page_number = ?`, 
                [page, page, page, page, page]
            );

            if (boundaryData && boundaryData.middle_ayah) {
                queue.push({
                    type: 'BOUNDARY',
                    question: boundaryData.middle_ayah,
                    answer: {
                        start: boundaryData.start_ayah,
                        end: boundaryData.end_ayah
                    },
                    hint: `Page ${page}`
                });
            }
        } catch (innerError) {
            console.warn("Failed to generate a Boundary question, skipping...", innerError);
        }
    }

    return shuffle(queue);

  } catch (error) {
    console.error("Critical Error in generateHifzTest:", error);
    throw error; 
  }
};