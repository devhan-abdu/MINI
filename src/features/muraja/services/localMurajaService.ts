import { SQLiteDatabase } from "expo-sqlite";
import { IDailyMurajaLog, IMurajaDashboardData, IWeeklyMurajaPLan } from "../types";


export const localMurajaService = {
    async createPlan(db: SQLiteDatabase, planData: Omit<IWeeklyMurajaPLan, "id">) {

        let lastId: number = 0
         await db.withTransactionAsync( async() => {
            
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
                `
                INSERT INTO user_stats (user_id , muraja_last_page)
                VALUES (?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                  muraja_last_page = excluded.muraja_last_page
                `,[planData.user_id, planData.start_page -1]
            )
           
        })

        return lastId
    },

    async getDahsboardState(db: SQLiteDatabase, userId: string) {
        const query = `
         SELECT
         p.*,
         s.muraja_last_page,
         s.muraja_current_streak
         FROM weekly_muraja_plan p
         LEFT JOIN user_stats s ON p.user_id = s.user_id
         WHERE p.user_id = ? AND p.is_active = 1
         LIMIT 1
        `

        const plan = await db.getFirstAsync<IMurajaDashboardData>(query, [userId])
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
    },

    async upsertLog(db:SQLiteDatabase, userId: string,log: IDailyMurajaLog) {
         
            let localLogId = null
            await db.withTransactionAsync( async() => {     
        
            const result = await db.runAsync(
            `INSERT INTO daily_muraja_logs (
                date, plan_id, start_page, completed_pages, 
                sync_status, is_catchup, actual_time_min, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(date, plan_id) DO UPDATE SET
                completed_pages = excluded.completed_pages,
                status = excluded.status,
                actual_time_min = excluded.actual_time_min,
                is_catchup = excluded.is_catchup,
                start_page = excluded.start_page,
                sync_status = excluded.sync_status
            `,
            [
                log.date,
                log.plan_id,
                log.start_page,
                log.completed_pages,
                0,
                log.is_catchup,
                log.actual_time_min,
                log.status,
            ]
            );

            localLogId = result.lastInsertRowId;
                        
           await db.runAsync(
            `INSERT INTO user_stats (user_id, muraja_last_page)
            VALUES (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                muraja_last_page =  excluded.muraja_last_page
            `,
            [userId, log.start_page + log.completed_pages -1]
            );
           
        })

        return localLogId
    },
    

}


