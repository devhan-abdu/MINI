import { supabase } from "@/src/lib/supabase";
import { IDayLogAdd, IMonthHistory, IWeeklyMurajaDayInsert, WeeklyMurajaType } from "@/src/types";

const FULL_PLAN_SELECT = `
*,
weekly_plan_days (
 *,
 daily_muraja_logs (*)
)`

const FULL_HISTORY_SELECT = `
  id,
  week_start_date,
  week_end_date,
  start_surah,
  end_surah,
  start_page,
  end_page,
  start_juz,
  end_juz,
  planned_pages,
  status,
  estimated_time_min,
  weekly_plan_days (
    id,
    date,
    day_of_week,
    planned_pages,
    planned_start_page,
    weekly_plan_id,
    planned_end_page,
    estimated_time_min,
    daily_muraja_logs (
      id,
      completed_pages,
      actual_time_min,
      weekly_plan_day_id,
      date,
      status,
      note,
      place
    )
  )
`; 

export const murajaServices = {
    
  async createCompletePlan({ planData, days }: { planData: WeeklyMurajaType, days: IWeeklyMurajaDayInsert[] }) {

    const { error: updateError } = await supabase
      .from("weekly_muraja_plan")
      .update({ status: "paused" })
      .eq("user_id", planData.user_id)
      .eq("status", "active")
    
    if (updateError) throw new Error("Failed to Archive the plan")
    
     const { data: newPlan, error: planError } = await supabase
      .from("weekly_muraja_plan")
      .insert(planData)
      .select()
      .single();
    
    
    if (planError) throw new Error(`${planError.message}`)
        
      const linkedDays = days.map(day => ({ ...day, weekly_plan_id: newPlan.id }))
       
       const { error: daysError } = await supabase
            .from("weekly_plan_days")
            .insert(linkedDays);
        
        if (daysError) {
            await supabase.from("weekly_muraja_plan").delete().eq("id", newPlan.id);
            throw new Error(`Plan creation failed`);     
        }
        
        return newPlan
    },

      async getDashboardState(userId: string): Promise<IMonthHistory | null> {
        const { data, error } = await supabase
            .from("weekly_muraja_plan")
            .select(FULL_PLAN_SELECT)      
            .eq("user_id", userId)        
            .eq("status", "active")           
            .order("week_start_date", { ascending: false })
            .limit(1)    
            .maybeSingle();
        
        if (error) throw new Error(`[murajaService.getDashboardState`);
         return data;
        
    },

    async upsertLog(logData: Partial<IDayLogAdd>) {
       if (!logData.userId || !logData.dayId) throw new Error("Missing foreign keys");

      const { userId, dayId, ...rest } = logData
      
      const targetDate = logData.date || new Date().toISOString().slice(0, 10);  
      
       const { data, error } = await supabase
      .from("daily_muraja_logs")
      .upsert({
         user_id: userId,
        weekly_plan_day_id: dayId,
        date: targetDate,
         ...rest
      }, { onConflict: "user_id,weekly_plan_day_id,date" })
      .select()
      .single();

    if (error) throw new Error(`[murajaService.upsertLog]: ${error.message}`);
      return data;

    },


    async deletePlan(planId: number) {
        const { error } = await supabase
            .from("weekly_muraja_plan")
            .delete()          
            .eq("id", planId);
        
        if (error) throw new Error(`[murajaService.deletePlan]: ${error.message}`);
        
    },

    async getReviewStats(userId: string, planId?: number):Promise<IMonthHistory | null> {
      
      let query = supabase
      .from("weekly_muraja_plan")
       .select(FULL_HISTORY_SELECT) 
        .eq("user_id", userId)
        .eq("status", "completed")

    if (planId) {
      query = query.eq("id", planId);
    } else {
      query = query
        .order("week_end_date", { ascending: false })
        .limit(1);
      }
    
    

     const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`[murajaService.getReviewStats]: ${error.message}`);
     return data ;
    },
    
    async getMonthlyHistory(year: number, month: number, userId: string): Promise<IMonthHistory[] > {
    const startDate = new Date(year, month - 1, 1).toISOString().slice(0, 10);
    const endDate = new Date(year, month, 0).toISOString().slice(0, 10);
    
    const { data, error } = await supabase
      .from("weekly_muraja_plan")
      .select(FULL_HISTORY_SELECT) 
      .eq("user_id", userId)
       .eq("status", "completed")
      .gte('week_end_date', startDate)
      .lte('week_start_date', endDate)
      .order("week_start_date", { ascending: false });
    
    if (error) throw new Error(`[murajaService.getMonthlyHistory]: ${error.message}`);
    
     return data ;
  }
    
 
}