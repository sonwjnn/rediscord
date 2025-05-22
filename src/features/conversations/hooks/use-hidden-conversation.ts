import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useHiddenConversation = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/user-conversations/${conversationId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to hide conversation')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-conversations'],
      })
    },
  })
}
