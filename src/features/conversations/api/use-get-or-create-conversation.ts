import { useMutation, useQueryClient } from '@tanstack/react-query'

import { UserConversationResponse } from '../types'

export const useGetOrCreateConversations = (userTwoId?: string) => {
  const queryClient = useQueryClient()

  return useMutation<UserConversationResponse>({
    mutationFn: async () => {
      if (!userTwoId) return null

      const response = await fetch(`/api/conversations/user/${userTwoId}`, {
        method: 'POST',
      })
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      })
    },
  })
}
