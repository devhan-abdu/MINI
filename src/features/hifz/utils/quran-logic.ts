import { ISurah } from "@/src/types";
import { getJuzByPage, getSurah } from "../../muraja/utils/quranMapping";

export const getNextTask = (
  direction: "backward" | "forward",
  lastLoggedPage: number,
  dailyRate: number,
  surahData: ISurah[],
  isNewPlan: boolean
) => {
  const isForward = direction === 'forward';
  let pageAllocated = 0;
  let startPage: number | null = null;
  let endPage: number | null = null;

  let currentPage = isNewPlan ? lastLoggedPage : 0;

  if (!isNewPlan) {
    const currentSurah = getSurah(lastLoggedPage, surahData);
    if (!currentSurah) return null;

    if (isForward) {
      currentPage = lastLoggedPage + 1;
    } else {
      // Backward logic: if at end of surah, jump to start of previous surah
      currentPage = (lastLoggedPage >= currentSurah.endingPage)
        ? (surahData.find(s => s.number === currentSurah.number - 1)?.startingPage || 1)
        : lastLoggedPage + 1;
    }
  }

  while (pageAllocated < dailyRate) {
    if (currentPage > 604 || currentPage < 1) break;

    if (startPage === null) startPage = currentPage;
    endPage = currentPage;
    pageAllocated++;

    const currentSurah = getSurah(currentPage, surahData);
    if (!currentSurah) break;

    if (isForward) {
      currentPage++;
    } else {
      if (currentPage >= currentSurah.endingPage) {
        const prevSurah = surahData.find(s => s.number === currentSurah.number - 1);
        if (!prevSurah) break;
        currentPage = prevSurah.startingPage;
      } else {
        currentPage++;
      }
    }
  }

  if (startPage === null || endPage === null) return null;

  const sSurah = getSurah(startPage, surahData);
  const eSurah = getSurah(endPage, surahData);

  return {
    startPage,
    endPage,
    startSurah: sSurah?.englishName,
    endSurah: eSurah?.englishName,
    displaySurah: sSurah?.number === eSurah?.number
      ? sSurah?.englishName
      : `${sSurah?.englishName} & ${eSurah?.englishName}`,
    juz: getJuzByPage(endPage),
    target: dailyRate
  };
};