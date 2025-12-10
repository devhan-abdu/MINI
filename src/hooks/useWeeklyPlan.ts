import { useCallback, useEffect, useState } from "react"
import {  WeeklyMurajaType } from "../types"
import { getWeeklyPlan } from "../services"

export const useWeeklyPlan = (userId: string | null) => {
    const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMurajaType | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    

    const refetch = useCallback(async () => {
            if (!userId) return
            
            try {
                setLoading(true)
                setError(null)
                const plan = await getWeeklyPlan(userId)
                setWeeklyPlan(plan)
            } catch (error: any) {
                 setError(error?.message || " Failed to load weekly plan")
            } finally {
                 setLoading(false)
            }
    }, [userId])
    

    useEffect(() => {
        refetch()
    }, [userId])
    
    return { weeklyPlan, loading, error, refetch }
}