import { getServerWithChannelsById } from '@/data/server'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface ServerPageProps {
  params: {
    serverId: string
  }
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const user = await currentUser()

  if (!user) {
    return redirect('/auth/login')
  }

  const server = await getServerWithChannelsById(params.serverId)

  if (!server) {
    return redirect('/')
  }

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return redirect('/')
  }

  return redirect(`/servers/${server.id}/channels/${initialChannel?.id}`)
}

export default ServerPage
