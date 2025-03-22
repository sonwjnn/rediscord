import { Statuses } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface Friend {
  id?: string
  userId: string
  name: string | null
  image: string | null
  status: Statuses | null
}

export const useGetAllFriends = (userId: string) => {
  return useQuery<Friend[]>({
    queryKey: ["all-friends", userId],
    queryFn: async () => {
      const response = await fetch(`/api/friends/all?userId=${userId}`);
      return response.json();
    }
  });
};
