import { supabase } from "@/src/lib/supabase"
import { IHifzLog, IHifzPlan } from "../types"

type ICreate = {
    planData: Omit<IHifzPlan, "hifz_daily_logs">,
}
type UpdatePlanPayload = {
  userId: string;
  newPlanData: Omit<IHifzPlan, "hifz_daily_logs" | "id">;
};
export const hifzServices = {
    async createPlan({ planData }: ICreate) {
        
        const { data: newPlan, error: planError } = await supabase
            .from("hifz_plan")
            .insert(planData)
            .select()
            .single()
        
        if (planError) throw new Error(` ${planError.message}`)
    
        return newPlan
    },
    
    async getplan(userId: string): Promise<IHifzPlan | null> {
        if (!userId) return null
        const { data, error } = await supabase
            .from('hifz_plan')
            .select(`
      *,
      hifz_daily_logs (
        id,
        actual_start_page,
        actual_end_page,
        actual_pages_completed,
        log_day,
        date,
        status,
        notes,
        created_at
      )
    `)
            .eq("user_id", userId)
            .eq("status", "active")
            .maybeSingle();
        
        if (error) throw new Error("Failed to get the hifz plan")
        return data
        
    },

    async updateAndReplacePlan({ userId, newPlanData }: UpdatePlanPayload) {
        const { error: updateError } = await supabase
            .from("hifz_plan")
            .update({ status: 'paused' })
            .eq("user_id", userId)
            .eq("status", "active")
        
      
        if (updateError) throw new Error(updateError.message)
        
        return await this.createPlan({ planData: { ...newPlanData, user_id: userId, status: 'active' } })
    },

    async todayLog({ todayLog, userId }: { todayLog: IHifzLog, userId?: string }) {
        if(!userId) return
        const { data, error } = await supabase
            .from("hifz_daily_logs")
            .upsert(
                {
                    ...todayLog,
                    user_id: userId
                },
                {
                    onConflict: "user_id,hifz_plan_id,date",
                }
            )
            .select()
            .eq("user_id", userId)
            .single()

        if (error) throw new Error(error.message)

        return data
    }

}