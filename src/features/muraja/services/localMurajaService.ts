import { SQLiteDatabase } from "expo-sqlite";
import { IWeeklyMurajaPLan } from "../types";

// type for all tables , user_status , logs 

export const localMurajaService = {
    async createPlan(db: SQLiteDatabase, planData: Omit<IWeeklyMurajaPLan, "id">) {

        let lastId: number = 0
        return await db.withTransactionAsync( async() => {
            
            await db.runAsync(
                "UPDATE weekly_muraja_plan SET is_active = 0 WHERE user_id = ? AND is_active = 1",
                [planData.user_id]
            )


         const result = await db.runAsync(
        `
        INSERT INTO weekly_muraja_plan (
                remote_id, 
                user_id, 
                week_start_date, 
                week_end_date, 
                planned_pages_per_day, 
                start_page, 
                end_page, 
                is_active, 
                selected_days, 
                sync_status, 
                estimated_time_min, 
                place, 
                note
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                null,
                planData.user_id,
                planData.week_start_date,
                planData.week_end_date,
                planData.planned_pages_per_day,
                planData.start_page,
                planData.end_page,
                1,                           
                planData.selected_days,       
                0,                            
                planData.estimated_time_min,
                planData.place ?? null,        
                planData.note ?? null
            ]
         );
            lastId = result.lastInsertRowId;
            
           await db.runAsync(
            "UPDATE user_stats SET muraja_last_page = ? WHERE user_id = ?",
            [planData.start_page - 1, planData.user_id]
           );
            
            await db.runAsync(
                `
                INSERT INTO user_stats (user_id , muraja_last_page)
                VALUES (?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                  muraja_last_page = excluded.muraja_last_page
                `[planData.user_id, planData.start_page -1]
            )
           
        })
    },

    async getPlan(db: SQLiteDatabase, userId: string): Promise<IWeeklyMurajaPLan | null> {
   
        const query = `
         SELECT * FROM weekly_muraja_plan
         WHERE user_id = ? AND is_active = 1
         LIMIT 1
        `

        return await db.getFirstAsync<IWeeklyMurajaPLan>(query, [userId])
    
    }, 
    async getDahsboardState(db: SQLiteDatabase, userId: string) {
        const query = `
         SELECT
         p.*,
         s.muraja_last_page,
         s.muraja_current_streak

         FROM weekly_muraja_plan p
         LEFT JOIN user_status s ON p.user_id = s.user_id
         WHERE p.user_id = ? AND p.is_active = 1
         LIMIT 1
        `

        const plan = await db.getFirstAsync<IWeeklyMurajaPLan>(query, [userId])
        if (!plan) return 
        
        const logQuery = `
         SELECT * FROM daily_muraja_logs
         WHERE plan_id = ?
         ORDER BY date ASC
        `

        const logs = await db.getAllAsync<any>(logQuery, [plan.id])
        
        return {
            ...plan,
            daily_logs: logs
        }
    }

}


