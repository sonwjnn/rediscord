import { Statuses } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface Friend {
  id?: string
  userId: string
  name: string | null
  image: string | null
  status: Statuses | null
}

interface Response  {
  incoming: Friend[]
  outgoing: Friend[]
}

export const useGetPendingReq = (userId: string) => {
  return useQuery<Response>({
    queryKey: ["pending-req", userId],
    queryFn: async () => {
      const response = await fetch(`/api/friends/pending?userId=${userId}`);
      return response.json();
    }
  });
};
