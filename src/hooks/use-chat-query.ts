import { getDirectMessageByConversationId } from '@/actions/direct-message'
import { getMessagesByChannelId } from '@/actions/message'
import { useSocket } from '@/providers/socket-provider'
import { useInfiniteQuery } from '@tanstack/react-query'

interface ChatQueryProps {
  queryKey: string
  type: 'channel' | 'conversation'
  channelId: string
  conversationId: string
}

export const useChatQuery = ({
  queryKey,
  type,
  channelId,
  conversationId,
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam: string | undefined
  }) => {
    let res

    if (type === 'channel') {
      res = await getMessagesByChannelId({
        cursor: pageParam,
        channelId: channelId,
      })
    } else if (type === 'conversation') {
      res = await getDirectMessageByConversationId({
        cursor: pageParam,
        conversationId: conversationId,
      })
    }

    return JSON.parse(JSON.stringify(res))
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: lastPage => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
