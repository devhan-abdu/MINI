
import { useSession } from "@/src/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hifzServices } from "../services/hifz";

export function useCreateHifz() {
    const { user } = useSession()
    const queryClient = useQueryClient()
    
    const mutation = useMutation({
        mutationFn: hifzServices.createPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["hifz", user?.id]})
        }
    })

    return {
        createHifz: mutation.mutateAsync,
        isCreating: mutation.isPending,
        error: mutation.error
    }
}

