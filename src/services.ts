import { supabase } from "./lib/supabase";
import { IDayLog, IDayLogAdd, IWeeklyMurajaDay, WeeklyMurajaType } from "./types";


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

export async function addDailyLog(logData: Partial<IDayLogAdd>) {
    const { dayId, userId, status, date, note, pages, min, place } = logData
     
    if (!userId || !dayId || !date || !status) {
    throw new Error("Missing required fields")
  }
    const { data, error } = await supabase
        .from("daily_muraja_logs")
        .upsert({
            user_id: userId,
            weekly_plan_day_id: dayId,
            status,
            date,
            note,
            place,
            actual_time_min: min,
            completed_pages: pages,
        },
      {
        onConflict: "user_id,weekly_plan_day_id,date",
      }    
    )
        
    .select()
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

export async function getDailyLog(userId: string | null, dayId: number | null): Promise<IDayLog | null> {
     if(!userId || !dayId) return null
    const { data, error } = await supabase
        .from("daily_muraja_logs")
        .select("*")
        .eq("user_id",userId)
        .eq("weekly_plan_day_id", dayId)
        .limit(1)
        .single()
    
    
    if (error) {
        throw new Error(error.message)
    }

     return data ?? null;
    
}

export async function getWeekLogs(weeklyPlanId: number) {
    if (!weeklyPlanId) return []
    
    const { data, error } = await supabase
        .from("weekly_plan_days")
       .select(`
      id,
      date,
      day_of_week,
      planned_start_page,
      planned_end_page,
      planned_pages,
      daily_muraja_logs (
        id,
        completed_pages,
        actual_time_min,
        status,
        note,
        place
      )
    `)
        .eq("weekly_plan_id", weeklyPlanId)
        .order("date", { ascending: true })
    
      if (error) {
          throw new Error(error.message)
          
          return data ?? []
  }
    
}
export async function syncAndGetLatestCompletedWeek(userId: string) {
  if (!userId) return null

  const today = new Date().toISOString().slice(0, 10)

  const { error: updateError } = await supabase
    .from("weekly_muraja_plan")
    .update({ status: "completed" })
    .eq("user_id", userId)
    .eq("status", "active")
    .lt("week_end_date", today)

  if (updateError) {
    throw new Error(updateError.message)
  }

  const { data, error: fetchError } = await supabase
    .from("weekly_muraja_plan")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("week_end_date", { ascending: false })
    .limit(1)
    .single()

  if (fetchError) {
    return null 
  }

  return data
}
