import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useHiddenConversation = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to hide conversation')
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] })

      const previousConversations = queryClient.getQueryData(['conversations'])

      queryClient.setQueryData(['conversations'], (old: any) => {
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
          ['conversations'],
          context.previousConversations
        )
      }
    },
  })
}
