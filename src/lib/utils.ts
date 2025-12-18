import { ISurah } from "../types";

export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}


const juzStartPages = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582, 604
];

const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export function getPlannedDates(
  weekStartDate: string,
  selectedDays: number[],
  plannedPages: number,
  startPage: number
) {
  const result: { date: string; day_of_week: string; planned_start_page: number; planned_end_page: number; planned_pages: number; }[] = [];
  const start = new Date(weekStartDate);
  let currentPage = startPage;

  selectedDays.forEach((offset) => {
    const d = new Date(start);
    d.setDate(start.getDate() + offset);

    result.push({
      date: d.toISOString().slice(0, 10),
      day_of_week: dayNames[d.getDay()],
      planned_start_page: currentPage,
      planned_end_page: currentPage + plannedPages - 1,
      planned_pages: plannedPages,
    });

    currentPage += plannedPages;
  });

  return result;
}

export function getWeeklyPlanData(startPage: number , plannedPages: number, selectedDaysLength: number, surah: ISurah[]) {
  const endPage = startPage + plannedPages * selectedDaysLength - 1
  const startSurah = getSurahByPage(startPage, surah)
  const endSurah = getSurahByPage(endPage, surah)
  const startJuz = getJuzByPage(startPage)
  const endJuz = getJuzByPage(endPage)

  return {  startSurah,endPage, endSurah, startJuz, endJuz}
}

export function getJuzByPage(page: number) {
  for (let i = juzStartPages.length - 1; i >= 0; i--) {
    if (page >= juzStartPages[i]) return i + 1;
  }
}

export function getSurahByPage(page: number, surah: ISurah[]) {
     return surah.find(s => page >=s.startingPage && page <= s.endingPage)?.englishName
}

