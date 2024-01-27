import { InitialModal } from '@/components/modals/initial-modal'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

const SetupPage = async () => {
  const user = await currentUser()

  if (!user) {
    return redirect('/auth/login')
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!server) {
    return <InitialModal />
  }

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return <InitialModal />
  }

  return redirect(`/servers/${server.id}/channels/${initialChannel?.id}`)
}

export default SetupPage
