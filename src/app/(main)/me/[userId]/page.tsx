'use client'

import {
  ChatDirectMessages,
  ChatMessagesSkeleton,
} from '@/components/chat/chat-direct-messages'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { MediaRoom } from '@/components/media-room'
import { useGetOrCreateConversations } from '@/features/conversations/hooks/use-get-or-create-conversation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { UserIdLoading } from './user-id-loading'

const UserIdPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const serverId = (params?.serverId as string) || ''
  const userId = (params?.userId as string) || ''
  const video = searchParams?.get('video') === 'true'
  const user = useCurrentUser()
  const {
    mutate,
    data: conversation,
    isPending,
  } = useGetOrCreateConversations(userId)

  useEffect(() => {
    ;(() => {
      mutate()
    })()
  }, [])

  if (isPending) {
    return <UserIdLoading />
  }

  if (!conversation) return null

  const otherUser =
    conversation?.userOne.id === user?.id
      ? conversation?.userTwo
      : conversation?.userOne

  const otherUserName = otherUser.name || ''
  const otherImage = otherUser.image || ''

  if (!user) return null

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherImage}
        name={otherUserName}
        serverId={serverId}
        type="conversation"
      />
      {video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!video && (
        <>
          <ChatDirectMessages
            currentUser={user}
            name={otherUserName}
            chatId={conversation.id}
            type="conversation"
            conversationId={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherUserName}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}

export default UserIdPage
