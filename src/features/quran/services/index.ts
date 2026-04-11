import { SQLiteDatabase } from "expo-sqlite";
import { File, Paths } from "expo-file-system";
import { Surah } from "../type";
import { ISurah } from "@/src/types";

export async function getJuz(db: SQLiteDatabase) {
  try {
    const juzList = await db.getAllAsync<{ joza: number }>(
      `SELECT DISTINCT joza FROM aya ORDER BY joza`
    );

    const result = [];

    for (const j of juzList) {
      const surahs = await db.getAllAsync<
        Surah
      >(
        `SELECT 
          a.soraid as number,
          s.name,
          s.name_english as englishName,
                (
            SELECT COUNT(*) 
            FROM aya a2 
            WHERE a2.soraid = a.soraid
            AND a2.ayaid > 0
          ) as numberOfAyahs,
          CASE
              WHEN s.place = 1 THEN 'Meccan'
              ELSE 'Medinan'
          END as revelationType,    
          MIN(a.page) as startingPage,
          MAX(a.page) as endingPage
        FROM aya a
        JOIN sora s ON s.soraid = a.soraid
        WHERE a.joza = ?
        GROUP BY a.soraid
        ORDER BY a.soraid`,
        [j.joza]
      );

      result.push({
        juzNumber: j.joza,
        surahs,
      });
    }

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getSurah(db: SQLiteDatabase) {
  try {
    const result = await db.getAllAsync<ISurah>(
      `SELECT 
        s.soraid as number,
        s.name,
        s.name_english as englishName,

        -- total ayah count
        (
          SELECT COUNT(*) 
          FROM aya a 
          WHERE a.soraid = s.soraid
           AND a2.ayaid > 0
        ) as numberOfAyahs,

        CASE
          WHEN s.place = 1 THEN 'Meccan'
          ELSE 'Medinan'
        END as revelationType,

        -- full surah page range
        (
          SELECT MIN(page) FROM aya a WHERE a.soraid = s.soraid
        ) as startingPage,

        (
          SELECT MAX(page) FROM aya a WHERE a.soraid = s.soraid
        ) as endingPage

      FROM sora s
      ORDER BY s.soraid`
    );

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}




const BASE_URL = "https://uungvwtrbfqatqtqbqef.supabase.co/storage/v1/object/quran-pages/";
const activeDownloads = new Map<number, Promise<string | null>>();

export async function getPageImage(page: number): Promise<string | null> {
  const pageFile = new File(Paths.document, `page_${page}.png`)
 
  if (pageFile.exists) {
    return pageFile.uri
  }

    if (activeDownloads.has(page)) {
    return activeDownloads.get(page)!;
    }
  
  const downloadPromise = (async () => {

    try {
    const remoteUrl = `${BASE_URL}${page}.png`;
    await File.downloadFileAsync(remoteUrl, pageFile);
    return pageFile.uri
  } catch (error) {
     console.error("Download failed:", error);
    return null
    } finally {
      activeDownloads.delete(page)
  }
  })()

  activeDownloads.set(page, downloadPromise)  
   return downloadPromise
  

}

export async function prefetchPages(currentPage: number) {
  const nextPages = [currentPage + 1, currentPage + 2];

 for (const p of nextPages) {
    if (p >= 1 && p <= 604) {
      getPageImage(p); 
    }
  }
}