import { supabase } from "./lib/supabase";
import { IDayLog, IDayLogAdd, IWeeklyPlan, IWeeklyMurajaDay, WeeklyMurajaType } from "./types";


export async function addWeeklyPlan(weeklyMuraja: WeeklyMurajaType) {
    const { data, error } = await supabase.from("weekly_muraja_plan")
    .insert([ {...weeklyMuraja}]).select().single()

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
      
    
    
  if (error) {  
        throw new Error(error.message)
    }

     return data[0] ?? null;
    
}


export async function getWeeklyReviewData(userId: string | null , planId?: number) {
  if (!userId) return null

  // const today = new Date().toISOString().slice(0, 10)

  // const { error: updateError } = await supabase
  //   .from("weekly_muraja_plan")
  //   .update({ status: "completed" })
  //   .eq("user_id", userId)
  //   .eq("status", "active")
  //   .lt("week_end_date", today)

  // if (updateError) {
  //   throw new Error(updateError.message)


  // }

  let query = supabase
   .from("weekly_muraja_plan")
  .select(`
    id,
    user_id,
    week_start_date,
    week_end_date,
    estimated_time_min,
    weekly_plan_days (
      id,
      date,
      day_of_week,
      planned_pages,
      daily_muraja_logs (
        id,
        completed_pages,
        actual_time_min,
        date,
        status,
        note,
        place
      )
    )
  `)
    .eq("user_id", userId)
  

  if (planId) {
    query = query.eq("id", planId)
  } else {
    query = query
      .eq("status", "completed")
      .order("week_end_date", { ascending: false }) 
      .limit(1)
    
  }

  const { data, error } = await query.single()
  

  if (error) {
    return null 
  }

  return data
}
