import {  useMemo } from "react"
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/src/hooks/useSession";
import { getJuzByPage, getSurahByPage } from "../utils/quranMapping";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { localMurajaService } from "../services/localMurajaService";
import { useSQLiteContext } from "expo-sqlite";
import { calculateExpectedPages, generateWeeklyProgress, getPerformanceStatus } from "../utils/murajaAnalytics";


export const useWeeklyMuraja = () => {
   const { user } = useSession();
    const db = useSQLiteContext();
    const { items: surah } = useLoadSurahData();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["muraja-dashboard", user?.id],
         queryFn: async () => {
        if (!user?.id) return null;
        const result = await localMurajaService.getDahsboardState(db, user.id);
        return result ?? null; 
        },
        enabled: !!user?.id && !!surah,
    });

   
    const processedData = useMemo(() => {
        if (!data || !surah) return null;

        const {
            id,daily_logs, selected_days, start_page, end_page,
            planned_pages_per_day, muraja_last_page, muraja_current_streak,
            week_start_date, week_end_date, estimated_time_min,
        } = data;

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        const activeDays = JSON.parse(selected_days) as number[];

        const expectedPages = calculateExpectedPages(
            week_start_date, week_end_date, today, activeDays, planned_pages_per_day
        );
        const totalCompletedPages = daily_logs.reduce((acc: number, curr: any) => acc + curr.completed_pages, 0);
        const pageDiff = totalCompletedPages - expectedPages;
        const performanceStatus = getPerformanceStatus(pageDiff);

        const isScheduledToday = activeDays.includes(today.getDay());
        const todayLog = daily_logs.find((log: any) => log.date === todayStr);
        const isPlanActiveNow = today >= new Date(week_start_date) && today <= new Date(week_end_date);

        let todayTask = null;
        if (isPlanActiveNow && (isScheduledToday || pageDiff < 0)) {
            const targetToStart =muraja_last_page + 1;
            const pagesToRead = isScheduledToday ? planned_pages_per_day : Math.min(planned_pages_per_day,Math.abs(pageDiff));
            const targetEnd = Math.min(targetToStart + pagesToRead - 1, end_page);

            todayTask = {
                isCompleted: !!todayLog,
                isCatchup: !isScheduledToday && pageDiff < 0,
                startPage: todayLog ? todayLog.start_page : targetToStart,
                endPage: todayLog ? todayLog.end_page : targetEnd,
                completedPages: todayLog?.completed_pages ?? 0,
                startSurah: getSurahByPage(todayLog ? todayLog.start_page : targetToStart, surah),
                endSurah: getSurahByPage(todayLog ? todayLog.end_page : targetEnd, surah),
            };
        }

        const startJuz = getJuzByPage(start_page) ?? 0; 
        const endJuz = getJuzByPage(end_page) ?? 0;
        const startSurah = getSurahByPage(start_page, surah) ?? ""; 
        const endSurah = getSurahByPage(end_page, surah) ?? "";

        return {
            weeklyPlan: {
                id, 
                totalPage: planned_pages_per_day * activeDays.length,
                totalDays: activeDays.length,
                week_start_date,
                week_end_date,
                estimated_time_min,
                planned_pages_per_day,
                startJuz,
                endJuz,
                startSurah,
                endSurah

            },
            stats: {
                totalCompletedPages,
                pageDiff,
                performanceStatus,
                streak: muraja_current_streak,
                overAllProgress: ((totalCompletedPages / (end_page - start_page + 1)) * 100).toFixed(1)
            },
            todayTask,
            weekProgress: generateWeeklyProgress(week_start_date, todayStr, activeDays, daily_logs)
        };
    }, [data, surah]);
  

    return {
       ...processedData,
        loading: isLoading,
        error: isError,
        refetch
    };
};

