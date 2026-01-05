import { useSession } from "@/src/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hifzServices } from "../services/hifz";
import { router } from "expo-router";

export function useUpdateHifzPlan() {
    const queryClient = useQueryClient();
    const { user } = useSession();
    
    const mutation = useMutation({
        mutationFn: hifzServices.updateAndReplacePlan, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hifz", user?.id] });
            router.back(); 
        },
    });

    return {
        updatePlan: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        error: mutation.isError
    };
}