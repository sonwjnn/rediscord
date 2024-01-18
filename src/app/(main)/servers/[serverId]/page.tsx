import { getServerWithChannelsById } from '@/data/server'
import { redirect } from 'next/navigation'

interface ServerIdPageProps {
  params: {
    serverId: string
  }
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const server = await getServerWithChannelsById(params.serverId)

  if (!server) {
    return redirect('/')
  }

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return null
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage
