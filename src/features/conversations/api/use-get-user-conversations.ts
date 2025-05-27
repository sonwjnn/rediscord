import { useQuery } from '@tanstack/react-query'

import { UserConversationResponse } from '../types'

export const useGetUserConversations = () => {
  return useQuery<UserConversationResponse[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch(`/api/conversations`)
      return await response.json()
    },
  })
}
