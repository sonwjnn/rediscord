import { Statuses } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface Friend {
  id?: string
  userId: string
  name: string | null
  image: string | null
  status: Statuses | null
}

export const useGetOnlineFriends = (userId: string) => {
  return useQuery<Friend[]>({
    queryKey: ["online-friends", userId],
    queryFn: async () => {
      const response = await fetch(`/api/friends/online?userId=${userId}`);
      return response.json();
    }
  });
};
