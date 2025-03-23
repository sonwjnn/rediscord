import { Statuses } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface Friend {
  id?: string
  userId: string
  name: string | null
  image: string | null
  status: Statuses | null
}

export const useGetAllFriends = () => {
  return useQuery<Friend[]>({
    queryKey: ["all-friends"],
    queryFn: async () => {
      const response = await fetch(`/api/friends/all`);
      return response.json();
    }
  });
};
