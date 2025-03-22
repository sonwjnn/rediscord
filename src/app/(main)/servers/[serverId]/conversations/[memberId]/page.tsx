import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatChannelMessages } from '@/components/chat/chat-channel-messages'
import { MediaRoom } from '@/components/media-room'
import { getOrCreateConversation } from '@/data/conversation'
import { getCurrentMemberOfServerWithUser } from '@/data/member'
import { getServerWithChannelsWithMembers } from '@/data/server'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface MemberIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const user = await currentUser()

  if (!user) {
    return redirect('/auth/login')
  }
  const server = await getServerWithChannelsWithMembers(params.serverId)

  if (!server) {
    return redirect('/')
  }

  const currentMember = await getCurrentMemberOfServerWithUser(params.serverId)

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  )

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const { userOne, userTwo } = conversation

  const otherUser = userOne.id === user.id ? userTwo : userOne

  const otherMemberName = otherUser.name || ''
  const otherImage = otherUser.image || ''

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherImage}
        name={otherMemberName}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatChannelMessages
            member={currentMember}
            name={otherMemberName}
            chatId={conversation.id}
            server={server}
            type="conversation"
            conversationId={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMemberName}
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

export default MemberIdPage
