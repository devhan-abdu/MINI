
import { useSession } from "@/src/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hifzServices } from "../services/hifz";

export function useAddLog() {
    const { user } = useSession()
    const queryClient = useQueryClient()
    
    const mutation = useMutation({
        mutationFn: hifzServices.todayLog,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["hifz", user?.id]})
        }
    })

    return {
        addLog: mutation.mutateAsync,
        isCreating: mutation.isPending,
        error: mutation.error
    }
}

