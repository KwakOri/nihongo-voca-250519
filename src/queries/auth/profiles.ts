import { getUserProfile } from "@/services/auth/profiles";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    enabled: !!userId,
    queryFn: () => getUserProfile(userId),
  });
};
