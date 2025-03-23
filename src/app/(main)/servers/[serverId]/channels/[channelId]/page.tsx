import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatChannelMessages } from '@/components/chat/chat-channel-messages'
import { MediaRoom } from '@/components/media-room'
import { getChannelById } from '@/data/channel'
import { getCurrentMemberOfServer } from '@/data/member'
import { getServerWithChannelsWithMembers } from '@/data/server'
import { currentUser } from '@/lib/auth'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

import { Container } from './_components/container'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const awaitedParams = await params;
  
  const channel = await getChannelById(awaitedParams.channelId)

  const member = await getCurrentMemberOfServer(awaitedParams.serverId)

  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  const server = await getServerWithChannelsWithMembers(awaitedParams.serverId)

  if (!channel || !member || !server) {
    return redirect('/')
  }

  return (
    <>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
        members={server.members}
        server={server}
      />
      <Container members={server?.members} server={server}>
        {channel.type === ChannelType.TEXT && (
          <>
            <ChatChannelMessages
              member={member}
              server={server}
              name={channel.name}
              chatId={channel.id}
              type="channel"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              channelId={channel.id}
            />
            <ChatInput
              name={channel.name}
              type="channel"
              apiUrl="/api/socket/messages"
              query={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
            />
          </>
        )}
        {channel.type === ChannelType.AUDIO && (
          <MediaRoom chatId={channel.id} video={false} audio={true} />
        )}
        {channel.type === ChannelType.VIDEO && (
          <MediaRoom chatId={channel.id} video={true} audio={true} />
        )}
      </Container>
    </>
  )
}

export default ChannelIdPage
