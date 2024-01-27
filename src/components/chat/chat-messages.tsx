'use client'

import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { Member, Message, User } from '@prisma/client'
import { format } from 'date-fns'
import { Loader2, ServerCrash } from 'lucide-react'
import { ElementRef, Fragment, useRef } from 'react'

import { ChatItem, ChatItemSkeleton } from './chat-item'
import { ChatWelcome } from './chat-welcome'

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User
  }
}

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  socketUrl: string
  socketQuery: Record<string, string>
  channelId?: string
  conversationId?: string
  type: 'channel' | 'conversation'
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  socketUrl,
  socketQuery,
  channelId,
  conversationId,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      type,
      channelId: channelId || '',
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

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
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
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithUser) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
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
