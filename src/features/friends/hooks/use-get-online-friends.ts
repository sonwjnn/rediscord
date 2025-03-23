import { useCurrentUser } from "@/hooks/use-current-user";
import { Statuses } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface Friend {
  id?: string
  userId: string
  name: string | null
  image: string | null
  status: Statuses | null
}

export const useGetOnlineFriends = () => {
  return useQuery<Friend[]>({
    queryKey: ["online-friends"],
    queryFn: async () => {
      const response = await fetch(`/api/friends/online`);
      return response.json();
    }
  });
};
