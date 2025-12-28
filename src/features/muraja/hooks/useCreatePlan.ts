import { useSession } from "@/src/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { murajaServices } from "../services/murajaServices";

export function useCreatePlan() {
    const { user } = useSession()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: murajaServices.createCompletePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["muraja-dashboard", user?.id]})
        }
    })

    return {
        createPlan: mutation.mutateAsync,
        isCreating: mutation.isPending,
        error: mutation.error
    }
}