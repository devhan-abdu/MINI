import { ISurah } from "@/src/types";
import { IHifzPlan, IHifzLog } from "../types";
import { countPlannedDaysElapsed } from "./plan-calculations";
import { getNextTask } from "./quran-logic";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const isWithinCurrentWeek = (date: Date) => {
  const now = new Date();

  const startOfWeek = new Date(now);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);

  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
};

export const hifzStatus = (data: IHifzPlan | null, surah?: ISurah[]) => {


  if (!data || !surah) return null;


  const today = new Date()

  today.setHours(0,0,0,0)

  const startDate = new Date(data.start_date)


  const diffInMs = today.getTime() - startDate.getTime()

  const daysElapsed = Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60 * 24))) 

  const plannedDayElapsed = countPlannedDaysElapsed(startDate,today,data.selected_days)

  

  const logs = data.hifz_daily_logs || []


  const stats = logs.reduce((acc, log) => {

     acc.actualPagesDone += (log.actual_pages_completed || 0);

     if (log.status !== "missed") acc.successLogs++;

    return acc;

 }, { successLogs: 0, actualPagesDone: 0, lastPageFinished: 0 });

  

  const lastLog = logs[logs.length -1]

  const referencePage = lastLog ? lastLog.actual_end_page : data.start_page;

  const isNewPlan = !lastLog;

  

  const nextTask = getNextTask(

    data.direction,

    referencePage,

    data.pages_per_day,

    surah,

    isNewPlan

  )


  

  const isTodayPlanned = data.selected_days.includes(today.getDay())

  const hasTodayLog = logs.some(log => {

  const d = new Date(log.date)

  d.setHours(0, 0, 0, 0)

  return d.getTime() === today.getTime()

  })

  const missablePlannedDays =

  plannedDayElapsed -

  (isTodayPlanned && !hasTodayLog ? 1 : 0)


  

  const missedCount = Math.max(0, missablePlannedDays - stats.successLogs)

  const plannedPages = missablePlannedDays * data.pages_per_day

  console.log()



  const isFirstDay = daysElapsed === 0;

  const displayPlannedPages = isFirstDay && stats.actualPagesDone === 0 

    ? data.pages_per_day 

    : Math.round(plannedPages);

  

 const accuracy = plannedPages > 0

    ? Math.min(Math.round((stats.actualPagesDone / plannedPages) * 100), 100)

   : 100;

   return {

     ...stats,

     missedCount,

     accuracy,

     remainingPages: Math.max(0, data.total_pages - stats.actualPagesDone),

     startSurah: nextTask?.startSurah,

     endSurah: nextTask?.endSurah,

     startPage: nextTask?.startPage,

     endPage: nextTask?.endPage,

     plannedPages: Math.round(plannedPages),

     displayPlannedPages,

     targetEndDate: data.estimated_end_date,

     todayTarget: data.pages_per_day

  };

}




export const getWeeklyStatus = (plan: IHifzPlan) => {
  const logs = plan.hifz_daily_logs || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(plan.start_date);
  startDate.setHours(0, 0, 0, 0);

  const todayIndex = today.getDay();

  const week = dayNames.map((name, index) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - todayIndex + index);
    dayDate.setHours(0, 0, 0, 0);

    const isPlanned = plan.selected_days.includes(index);

    return {
      name,
      isPlanned,
      isToday: index === todayIndex,
      isPast: isPlanned && dayDate < today && dayDate >= startDate,
      log: null as IHifzLog | null,
    };
  });

  logs.forEach((log) => {
    const logDate = new Date(log.date);

    if (isWithinCurrentWeek(logDate)) {
      const logDayIndex = logDate.getDay();
      week[logDayIndex].log = log;
    }
  });

  return week;
};
