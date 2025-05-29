'use client'

import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { ConversationReaction, DirectMessage, User } from '@prisma/client'
import { differenceInMinutes, format, sub } from 'date-fns'
import { Loader2, ServerCrash } from 'lucide-react'
import { ComponentRef, useRef } from 'react'

import { ExtendedUser } from '../../../next-auth'
import { ChatDirectItem } from './chat-direct-item'
import { ChatItemSkeleton } from './chat-item'
import { ChatWelcome } from './chat-welcome'

const TIME_THRESHOLD = 5
const DATE_FORMAT = 'yyyy-MM-dd'
const formatDateLabel = (dateStr: string) => {
  const date = format(dateStr, DATE_FORMAT)

  const today = format(new Date(), DATE_FORMAT)
  const yesterday = format(sub(new Date(), { days: 1 }), DATE_FORMAT)

  if (date === today) return 'Today'
  if (date === yesterday) return 'Yesterday'
  return format(date, 'MMM dd, yyyy')
}

type MessageWithUser = DirectMessage & {
  user: User
  reactions?: Array<
    Omit<ConversationReaction, 'userId'> & {
      count: number
      memberIds: string[]
    }
  >
}

interface ChatDirectMessagesProps {
  name: string
  currentUser: ExtendedUser
  socketUrl: string
  socketQuery: Record<string, string>
  conversationId: string
}

export const ChatDirectMessages = ({
  name,
  currentUser,
  socketUrl,
  socketQuery,
  conversationId,
}: ChatDirectMessagesProps) => {
  const queryKey = `chat:${conversationId}`
  const addKey = `chat:${conversationId}:messages`
  const updateKey = `chat:${conversationId}:messages:update`

  const chatRef = useRef<ComponentRef<'div'>>(null)
  const bottomRef = useRef<ComponentRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      type: 'conversation',
      channelId: '',
      conversationId: conversationId || '',
    })
  useChatSocket({ queryKey, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  // if (status === 'pending') {
  //   return <ChatMessagesSkeleton />
  // }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 size-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  const messages = (data?.pages?.reduce((acc, page) => {
    return [...acc, ...page.items]
  }, []) || []) as MessageWithUser[]

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt)
      const dateKey = format(date, 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey]?.unshift(message)
      return groups
    },
    {} as Record<string, MessageWithUser[]>
  )

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type="conversation" name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 size-6 animate-spin text-zinc-500" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="mt-auto flex flex-col-reverse">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="relative my-2 text-center">
              <hr className="absolute left-0 right-0 top-1/2 border-t border-zinc-200 dark:border-zinc-800" />
              <span className="relative inline-block rounded-full border border-zinc-200 bg-zinc-200 px-4 py-1 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-800">
                {formatDateLabel(dateKey)}
              </span>
            </div>

            {messages.map((message, index) => {
              const prevMessage = messages[index - 1]
              const isCompact =
                prevMessage &&
                prevMessage?.user?.id === message?.user?.id &&
                differenceInMinutes(
                  new Date(message.createdAt),
                  new Date(prevMessage.createdAt)
                ) < TIME_THRESHOLD
              return (
                <ChatDirectItem
                  key={message.id}
                  id={message.id}
                  currentUser={currentUser}
                  otherUser={message.user}
                  conversationId={message.conversationId}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  isCompact={isCompact}
                  reactions={message.reactions}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}

export const ChatMessagesSkeleton = () => (
  <div className="h-full flex-1">
    {[...Array(5)].map((_, i) => (
      <ChatItemSkeleton key={i} />
    ))}
  </div>
)
