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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user-conversations'] })

      const previousConversations = queryClient.getQueryData([
        'user-conversations',
      ])

      queryClient.setQueryData(['user-conversations'], (old: any) => {
        if (!old) return old

        return Array.isArray(old)
          ? old.filter(conversation => conversation.id !== conversationId)
          : old
      })

      return { previousConversations }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(
          ['user-conversations'],
          context.previousConversations
        )
      }
    },
  })
}
