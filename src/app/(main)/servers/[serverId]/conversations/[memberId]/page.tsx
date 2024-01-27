import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import { getOrCreateConversation } from '@/data/conversation'
import { getCurrentMemberOfServerWithUser } from '@/data/member'
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

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.userId === user.id ? memberTwo : memberOne

  const otherMemberName = otherMember.user.name || ''
  const otherImage = otherMember.user.image || ''

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
          <ChatMessages
            member={currentMember}
            name={otherMemberName}
            chatId={conversation.id}
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
