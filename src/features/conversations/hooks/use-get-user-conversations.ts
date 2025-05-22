import { useQuery } from '@tanstack/react-query'

import { UserConversationResponse } from '../types'

export const useGetUserConversations = () => {
  return useQuery<UserConversationResponse[]>({
    queryKey: ['user-conversations'],
    queryFn: async () => {
      const response = await fetch(`/api/user-conversations`)
      return await response.json()
    },
  })
}
