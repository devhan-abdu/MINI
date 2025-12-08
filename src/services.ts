import { supabase } from "./lib/supabase";
import { IWeeklyMurajaDay, WeeklyMurajaType } from "./types";


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