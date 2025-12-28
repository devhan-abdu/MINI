import {  useMemo } from "react"
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/src/hooks/useSession";
import { murajaServices } from "../services/murajaServices";
import { getSurahByPage } from "../utils/quranMapping";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";



export const useWeeklyMuraja = () => {
    const { user } = useSession();
    const { items: surah } = useLoadSurahData();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["muraja-dashboard", user?.id],
        queryFn: () => {
            if (!user?.id) return null;
            return murajaServices.getDashboardState(user.id);
        },
        enabled: !!user?.id && !!surah, 
    });

   
    const processedData = useMemo(() => {
        if (!data || !surah) return null;

        const todayStr = new Date().toISOString().slice(0, 10);

        const days = data.weekly_plan_days.map(day => {
            const startSurah = getSurahByPage(day.planned_start_page, surah);
            const endSurah = getSurahByPage(day.planned_end_page, surah);
            
            const log = day.daily_muraja_logs?.[0];
            

            return {
                ...day,
                startSurah,
                endSurah,
                status: log?.status ?? "pending",
                log_id: log?.id ?? null,
                actual_pages: log?.completed_pages ?? 0,
                actual_time: log?.actual_time_min ?? 0
            };
        });

        const todayPlan = days.find(p => p.date === todayStr) ?? null;
        const upcomingSessions = days.filter(p => p.date > todayStr);
        const {weekly_plan_days, ...rest} = data
          
        return {
            weeklyPlan: rest,
            days,
            todayPlan,
            upcomingSessions
        };
    }, [data, surah]); 

    return {
        weeklyPlan: processedData?.weeklyPlan ?? null,
        plans: processedData?.days ?? [],
        todayPlan: processedData?.todayPlan ?? null,
        upcomingSessions: processedData?.upcomingSessions ?? [],
        loading: isLoading,
        error: isError,
        refetch
    };
};

