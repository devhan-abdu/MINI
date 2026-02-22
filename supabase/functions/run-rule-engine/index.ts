import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const hifzBlockedUsers = new Set<string>()

 
  const { data: weeks, error } = await supabase
    .from("muraja_weekly_signal")
    .select("*")
    .eq("is_active", true)

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }

  for (const week of weeks ?? []) {
    let decision: string | null = null
    let reason = ""

    if (week.missed_days >= 2) {
      decision = "enter_recovery"
      reason = "missed two or more muraja days"
    }
    else if (week.completion_ratio < 0.50) {
      decision = "enter_recovery"
      reason = "muraja completion below 50%"
    }
    else if (week.completion_ratio >= 0.50 && week.completion_ratio < 0.75) {
      decision = "adjust_muraja_only"
      reason = "muraja completion between 50% and 75%"
    }
    else if (week.missed_days === 1) {
      decision = "monitor"
      reason = "single missed muraja day"
    }

    if (decision) {
      await supabase.from("plan_decisions").insert({
        user_id: week.user_id,
        plan_type: "muraja",
        plan_id: week.weekly_plan_id,
        decision,
        reason,
        decided_by: "rule_engine",
      })

      if (decision === "enter_recovery") {
        hifzBlockedUsers.add(week.user_id)

        await supabase.from("plan_decisions").insert({
          user_id: week.user_id,
          plan_type: "hifz",
          decision: "paused_due_to_muraja",
          reason: "muraja requires recovery priority",
          decided_by: "rule_engine",
        })
      }
    }
  }

 

  const { data: hifzWeeks, error: hifzError } = await supabase
    .from("hifz_weekly_signal")
    .select("*")

  if (hifzError) {
    return new Response(JSON.stringify(hifzError), { status: 500 })
  }

  for (const hifz of hifzWeeks ?? []) {
    if (hifzBlockedUsers.has(hifz.user_id)) {
      continue
    }

    let decision: string | null = null
    let reason = ""

    if (hifz.missed_days >= 5) {
      decision = "reduce_load"
      reason = "missed 5 or more hifz days"
    }
    else if (hifz.missed_days > 0 && hifz.missed_days <= 2) {
      decision = "gentle_catchup"
      reason = "minor hifz interruption"
    }

    if (decision) {
      await supabase.from("plan_decisions").insert({
        user_id: hifz.user_id,
        plan_type: "hifz",
        plan_id: hifz.hifz_plan_id,
        decision,
        reason,
        decided_by: "rule_engine",
      })
    }
  }

  return new Response(
    JSON.stringify({ status: "rule engine completed" }),
    { headers: { "Content-Type": "application/json" } }
  )
})