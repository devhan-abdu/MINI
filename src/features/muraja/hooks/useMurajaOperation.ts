import { useSession } from "@/src/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { localMurajaService } from "../services/localMurajaService";
import { useSQLiteContext } from "expo-sqlite";
import { IDailyMurajaLog } from "../types";
import { murajaServices } from "../services/murajaServices";

export function useMurajaOperation() {
    const { user } = useSession()
    const queryClient = useQueryClient()
    const db = useSQLiteContext()

    const mutation = useMutation({
        mutationFn: async (log: IDailyMurajaLog) => {
            if (!user?.id) throw new Error("User not found");
            
          const localId = await localMurajaService.upsertLog(db, user.id, log);             
           
            try {
          const remoteResponse = await murajaServices.upsertLog(log ,user.id);
        
        if (remoteResponse?.id) {
            await db.runAsync(
                "UPDATE daily_muraja_logs SET remote_id = ?, sync_status = 1 WHERE id = ?",
                [remoteResponse.id, localId]
            );
        }
      } catch (e: any) {
            console.warn("Sync failed - staying in offline mode:", e.message);        
            }
            
            return localId

        },     
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["muraja-dashboard", user?.id]})
        }
    })

    return {
        updateLog: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        error: mutation.error
    }
}

