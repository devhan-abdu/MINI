import { useSession } from "@/src/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { murajaServices } from "../services/murajaServices";
import { IDayLogAdd } from "@/src/types";

export function useMurajaOperation() {
    const { user } = useSession()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (vars: Partial<IDayLogAdd>) => 
            murajaServices.upsertLog({
                userId: user?.id,
                dayId: vars.dayId,
                ...vars
            }),
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