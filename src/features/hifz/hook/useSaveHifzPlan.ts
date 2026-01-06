
import { useSession } from "@/src/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hifzServices } from "../services/hifz";
import { IHifzPlan } from "../types";

export function useSaveHifzPlanHifz(existingPlanid?: number) {
    const { user } = useSession()
    const queryClient = useQueryClient()
    
    const mutation = useMutation({
        mutationFn:async (newPlanData: IHifzPlan) => {
            if (!user?.id) throw new Error("User not authenticated");
            
            if (existingPlanid) {
                await hifzServices.updateAndReplacePlan({
                    userId: user.id,
                    newPlanData 
                })
            } else {
                await hifzServices.createPlan({
                   planData: { ...newPlanData, user_id: user.id, status: 'active' }
                 })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["hifz", user?.id]})
        }
    })

    return {
        savePlan: mutation.mutateAsync,
        isSaving: mutation.isPending,
        error: mutation.error
    }
}

