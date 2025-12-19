import { useEffect, useState } from "react"
import {TodayPlanType } from "../types"
import { getWeeklyPlanDays, getWeeklyPlanLog } from "../services"
import { useLoadSurahData } from "./useFetchQuran"
import { getSurahByPage } from "../lib/utils"
import type {IWeeklyMurajaDay} from "../types"

export const useWeeklyDays = (userId: string | null, weeklyPlanId: number | null) => {
  const [plans , setPlans]= useState<TodayPlanType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const {items:surah } = useLoadSurahData()

  const today = new Date().toISOString().slice(0, 10)

  const preparePlan = async (plan: IWeeklyMurajaDay | null): Promise<TodayPlanType | null> => {
    if (!plan || !plan.id) return null
    const log = await getWeeklyPlanLog(userId, plan.id)
    const startSurah = getSurahByPage(plan?.planned_start_page, surah)
    const endSurah = getSurahByPage(plan.planned_end_page, surah)
    
    return {
      ...plan,
      startSurah: startSurah!,
      endSurah: endSurah!,
      status: log?.status ?? "pending",
      log_id: log?.id ?? null
    }
  }

  useEffect(() => {
    if (!userId || !weeklyPlanId || !surah) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        const rowPlans = await getWeeklyPlanDays(userId, weeklyPlanId)

        if (!rowPlans || rowPlans.length === 0) {
          setPlans([])
          return
        }

        const preparedPlans = await Promise.all(rowPlans.map(p => preparePlan(p)))
        const validPlans  = preparedPlans.filter((p): p is TodayPlanType => p !== null)
        setPlans(validPlans)

      } catch (err: any) {
        setError(err.message || "Failed to load weekly plan")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, weeklyPlanId, surah])

  const todayPlan = plans.find(p => p.date === today) ?? null
  const upcomingSessions = plans.filter(p => p.date > today)

  return {plans, todayPlan, upcomingSessions, loading, error }
}
