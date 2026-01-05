import { useSession } from "@/src/hooks/useSession"
import { useQuery } from "@tanstack/react-query";
import { hifzServices } from "../services/hifz";

export const useHifzPlan = () => {
    const { user } = useSession();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["hifz", user?.id],
        queryFn: () => {
            if (!user?.id) return null;
            return hifzServices.getplan(user.id)
        },
        enabled: !!user?.id 
    })

    return {
        hifz: data,
        isLoading,
        error: isError,
        refetch
    }
}