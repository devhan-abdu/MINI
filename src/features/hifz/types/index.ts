export interface IHifzLog {
    id?: number;
    hifz_plan_day_id: number;
    actual_start_page: number;
    actual_end_page: number;
    completed_pages: number;
    status: "completed" | "partial" | "missed",
    notes: string;
};

export interface IHifzPlanDays {
    id?: number;
    hifz_plan_id: number;
    date: string;
    planned_surah: string;
    planned_end_page: number;
    planned_pages: number;
    day_of_week: string;

    is_active: boolean;
    hifz_daily_logs?: IHifzLog[]
};

export interface IHifzPlan {
  id?: number;                 

  start_surah: string;
  start_page: number;

  days_per_week: number;
  target_end_date: string | null; 
  duration: number | null;

  total_pages: number;
  pages_per_day: number;
  pages_per_week: number;

  start_date: string;         
  estimated_end_date: string;  

    status: "active" | "completed" | "paused";
    HIFZ_PLAN_DAYS?: IHifzPlanDays[];
    
}
