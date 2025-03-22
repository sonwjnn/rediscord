import { ChatDirectMessages } from '@/components/chat/chat-direct-messages';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { MediaRoom } from '@/components/media-room';
import { getOrCreateConversation } from '@/actions/conversation'
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface UserIdPageProps {
  params: {
    userId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const UserIdPage = async ({ params, searchParams }: UserIdPageProps) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return redirect('/auth/login')
  }

  const conversation = await getOrCreateConversation(user.id, params.userId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const { userOne, userTwo } = conversation

  const otherUser = userOne.id === user.id ? userTwo : userOne

  const otherUserName = otherUser.name || ''
  const otherImage = otherUser.image || ''

  if(!user) return null

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherImage}
        name={otherUserName}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams.video && (
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