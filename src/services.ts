import { supabase } from "./lib/supabase";
import { IDayLog, IWeeklyMurajaDay, WeeklyMurajaType } from "./types";


export async function addWeeklyPlan(weeklyMuraja: WeeklyMurajaType) {
    const { data, error } = await supabase.from("weekly_muraja_plan")
    .insert([ {...weeklyMuraja}]).select();

    if(error) {
        throw new Error(error.message)
    }

    return data
}

export async function addWeeklyPlanDays(days: IWeeklyMurajaDay[])  {
    const { data, error } = await supabase.from("weekly_plan_days")
        .insert(days)
    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function addDailyLog(logData: {dayId: number, userId: string , status: string, date: string}) {
    const {dayId, userId, status, date } = logData
    const { data, error } = await supabase
        .from("daily_muraja_logs")
        .insert({
            weekly_plan_day_id: dayId,
            user_id: userId,
            status,
            date
        })
    if (error) throw new Error(error.message)
    return data

}

export async function getWeeklyPlan(userId: string): Promise<WeeklyMurajaType | null> {
    const { data, error } = await supabase
        .from("weekly_muraja_plan")
        .select("*")
        .eq("user_id", userId)
        .order("week_start_date", { ascending: false })
        .limit(1)
    
    if (error)
    {
        throw new Error(error.message)
    }
    if(!data || data.length === 0) return null
     return data[0]
  
}
export async function getWeeklyPlanDays(userId: string, weeklyPlanId: number): Promise<IWeeklyMurajaDay[]> {
    const { data, error } = await supabase
        .from("weekly_plan_days")
        .select("*")
        .eq("weekly_plan_id", weeklyPlanId)
        .order("date", { ascending: true })
    
    if (error) {
         throw new Error(error.message)
    }

     return data ?? [];    
}

export async function getWeeklyPlanLog(userId: string | null, dayId: number | null): Promise<IDayLog | null> {
     if(!userId || !dayId) return null
    const { data, error } = await supabase
        .from("daily_muraja_logs")
        .select("*")
        .eq("user_id",userId)
        .eq("weekly_plan_day_id", dayId)
    
    if (error) {
        throw new Error(error.message)
    }

      if(!data || data.length === 0) return null
     return data[0]
    
}