
import {IWeeklyPlan } from "../types";

export const computeWeeklyReview = (plan: IWeeklyPlan) => {
  const days = plan.weekly_plan_days || [];
  
 

 const summary = days.reduce((acc, day) => {
    const log = day.daily_muraja_logs?.[0];
    if (log) {
      if (log.status === "completed") acc.completed++;
      if (log.status === "missed") acc.missed++;
      if (log.status === "partial") acc.partial++;
      acc.totalTime += log.actual_time_min || 0;
      acc.totalPages += log.completed_pages || 0;
      acc.logCount++;
    }
    return acc;
  }, { completed: 0, missed: 0, partial: 0, totalTime: 0, totalPages: 0, logCount: 0 });
      
   



  let maxStreak = 0;
  let currentStreak = 0;
  let bestDayName = "N/A"
  let highestScore = -1;
  
  days.forEach(day => {
    const activity = day.daily_muraja_logs?.[0]
    
      if (activity && (activity.status === "completed" || activity.status === "partial")) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else if (activity && activity.status === "missed") {
              currentStreak = 0
      }
    
   if (activity) {
      const plannedPage = day.planned_pages || 0;
      const actualPages = activity.completed_pages || 0;
      const plannedTime = plan.estimated_time_min || 0;
      const actualTime = activity.actual_time_min || 0;

      let dayScore = 0;
      if (actualPages >= plannedPage && plannedPage > 0) {
        dayScore += 100; 
        dayScore += (actualPages - plannedPage) * 5; 
        
          const timeDiff = Math.abs(actualTime - plannedTime);
          dayScore += Math.max(0, 50 - timeDiff); 
      }

      if (dayScore > highestScore) {
        highestScore = dayScore;
        bestDayName = day.day_of_week;
      }
    }

  });

  const totalPlannedDays = days.length || 1

 return {
    completed: summary.completed,
    missed: summary.missed,
    partial: summary.partial,
    totalTime: summary.totalTime,
    totalPages: summary.totalPages,
    longestStreak: maxStreak,
    bestDay: bestDayName,
    avgSession: summary.logCount ? Math.round(summary.totalTime / summary.logCount) : 0,
    completionRate: Math.round((summary.completed / totalPlannedDays) * 100)
  };
};