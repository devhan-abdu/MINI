import { useEffect, useState } from "react"
import { IWeeklyMurajaDay, TodayPlanType } from "../types"
import { getWeeklyPlanDays, getWeeklyPlanLog } from "../services"

export const useWeeklyDays = (userId: string | null, weeklyPlanId: number | null) => {
  const [todayPlan, setTodayPlan] = useState<TodayPlanType | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<IWeeklyMurajaDay[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (!userId || !weeklyPlanId) return

    const fetchData = async () => {
      try {
        setLoading(true)

        const plans = await getWeeklyPlanDays(userId, weeklyPlanId)

        if (!plans || plans.length === 0) {
          setTodayPlan(null)
          setUpcomingSessions([])
          return
        }

        const planForToday = plans.find(p => p.date === today)

        if (planForToday && planForToday.id) {
          const log = await getWeeklyPlanLog(userId, planForToday.id)
          setTodayPlan({
            ...planForToday,
            status: log?.status ?? "pending",
            log_id: log?.id ?? null
          })
        } else {
          setTodayPlan(null)
        }

        const upcoming = plans.filter(p => p.date > today)
        setUpcomingSessions(upcoming)

      } catch (err: any) {
        setError(err.message || "Failed to load weekly plan")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, weeklyPlanId])

  return { todayPlan, upcomingSessions, loading, error }
}
