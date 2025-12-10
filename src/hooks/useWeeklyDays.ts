import { useEffect, useState } from "react"
import {  IWeeklyMurajaDay } from "../types"
import { getWeeklyPlanDays } from "../services"

export const useWeeklyDays = (userId: string, weeklyPlanId: number) => {
    const [weeklyPlanDays, setWeeklyPlanDays] = useState<IWeeklyMurajaDay[] | []>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    

    useEffect(() => {
        if (!userId) return
       
        const fetchData = async () => {
            try {
                setLoading(true)
                const plan = await getWeeklyPlanDays(userId, weeklyPlanId)
                setWeeklyPlanDays(plan)
            } catch (error: any) {
                 setError(error?.message || " Failed to load weekly plan")
            } finally {
                 setLoading(false)
            }
        }

        fetchData()
    }, [userId, weeklyPlanId])
    
    return { weeklyPlanDays, loading, error }
}