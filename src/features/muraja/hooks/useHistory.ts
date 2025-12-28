import {  useMemo } from "react"
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/src/hooks/useSession";
import { murajaServices } from "../services/murajaServices";


export const useHistory = (year:number , month:number) => {
    const { user } = useSession();

    const { data:plans = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["muraja-history", year, month],
        queryFn: () => {
            if (!user?.id) return null;
            return murajaServices.getMonthlyHistory(year, month, user.id);
        },
        enabled: !!user?.id && !!year && !!month , 
    });

   
    const {userHistory, weekHistory} = useMemo(() => {
        if (!plans) return  { userHistory: [], weekHistory: [] };;
        
       const history = plans.flatMap((week) =>
       week.weekly_plan_days.flatMap((day) =>
        day.daily_muraja_logs.map((log) => ({
        date: log.date,
        status: log.status,
         }))))
        
       const reviews = plans
           .map((p) =>( {
           id: p.id,
            week_start_date: p.week_start_date,
            week_end_date: p.week_end_date,
            start_surah: p.start_surah,
            end_surah: p.end_surah,
            start_page: p.start_page,
            end_page: p.end_page,
            start_juz: p.start_juz,
            end_juz: p.end_juz,
            planned_pages: p.planned_pages,
            estimated_time_min: p.estimated_time_min,
            status:p.status
       }))
      .filter((p) => p.status === "completed"); 
        
        return { userHistory: history, weekHistory: reviews };
        
    }, [plans]);
    
  

    return {
        userHistory,
        weekHistory,
        isLoading,
        isError,
        refetch
    };
};

