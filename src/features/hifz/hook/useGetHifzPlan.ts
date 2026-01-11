import { useSession } from "@/src/hooks/useSession"
import { useQuery } from "@tanstack/react-query";
import { hifzServices } from "../services/hifz";
import { useMemo } from "react";
import { useLoadSurahData } from "@/src/hooks/useFetchQuran";
import { getNextTask } from "../utils/quran-logic";

export const useGetHifzPlan = () => {
    const { user } = useSession()
    const {items: surahData} = useLoadSurahData()

    const { data: hifz, isLoading, isError, refetch } = useQuery({
        queryKey: ["hifz", user?.id],
        queryFn: () => {
            if (!user?.id) return null;
            return hifzServices.getplan(user.id)
        },
        enabled: !!user?.id 
    })

    const nextTask = useMemo(() => {
        if (!hifz || !surahData) return null;
        
           const logs = hifz.hifz_daily_logs || [];
           const lastLog = logs[logs.length - 1]
           const referencePage = lastLog ? lastLog.actual_end_page  : hifz.start_page
           
          
           const nextTask = getNextTask(
             hifz.direction,
             referencePage,
             hifz.pages_per_day,
             surahData,
             !lastLog
           );
        
           if (!nextTask) return null;
        
           return {
             ...nextTask,
             surah: nextTask.displaySurah, 
             isBackward: hifz.direction === "backward",
               target: hifz.pages_per_day,
             status: lastLog?.status 
           };
    },[hifz, surahData])

    return {
        nextTask,
        hifz,
        isLoading,
        error: isError,
        refetch
    }
}