import { getChannelById } from '@/data/channel'
import { getCurrentMemberOfServer } from '@/data/member'
import { getServerWithChannelsWithMembers } from '@/data/server'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

import { Container } from './_components/container'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const channel = await getChannelById(params.channelId)

  const member = await getCurrentMemberOfServer(params.serverId)

  const server = await getServerWithChannelsWithMembers(params.serverId)

  return <div>Direct Message Page</div>
}

export default ChannelIdPage
