import { max } from "date-fns";
import { ISurah } from "../types";

export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}


export const fullDayNames: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
};
  
const juzStartPages = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582, 604
];

const dayNames = [
  "Sunday",
  "Monday", 
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export function getPlannedDates(
  weekStartDate: string,
  selectedOffsets: number[],
  plannedPages: number,
  startPage: number
) {
  const startDate = new Date(weekStartDate);
  const startDayIdx = (startDate.getDay() + 6) % 7;
  
  const dateObjects = selectedOffsets.map((offset) => {
    let daysToAdd = offset - startDayIdx;
    if (daysToAdd < 0) daysToAdd += 7;
    
    const actualDate = new Date(startDate);
    actualDate.setDate(startDate.getDate() + daysToAdd);
    
    return {
      date: actualDate,
      dateString: actualDate.toISOString().slice(0, 10),
    };
  });
  
  dateObjects.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const result = dateObjects.map((obj, index) => {
    const planned_start_page = startPage + (index * plannedPages);
    const planned_end_page = planned_start_page + plannedPages - 1;
    
    return {
      date: obj.dateString,
      day_of_week: dayNames[obj.date.getDay()],
      planned_start_page,
      planned_end_page,
      planned_pages: plannedPages,
    };
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


export function formatWeekRange(start?: string | undefined, end?: string): string {
  if(!start || !end) return ""
  const s = new Date(start)
  const e = new Date(end)

  const monthFmt = new Intl.DateTimeFormat("en-us", { month: "short" })
  const dayFmt = new Intl.DateTimeFormat("en-us", { day: "numeric" })
  
  return `${monthFmt.format(s)} ${dayFmt.format(s)} – ${monthFmt.format(e)} ${dayFmt.format(e)}`
}