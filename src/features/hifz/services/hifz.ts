import { supabase } from "@/src/lib/supabase"
import { IHifzPlan } from "../types"

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
            .select("*")
            .eq("user_id", userId)
            .eq("status", "active")
            .maybeSingle();
        
        if (error) throw new Error("Failed to get the hifz plan")
        return data
        
    },

          async updateAndReplacePlan({ userId, newPlanData }: UpdatePlanPayload) {        const { error: updateError } = await supabase
            .from("hifz_plan")
            .update({ status: 'inactive' })
            .eq("user_id", userId)
            .eq("status", "active")
        
        if (updateError) throw new Error("Could not archive previous plan")
        
        return await this.createPlan({planData: newPlanData})
    }
}