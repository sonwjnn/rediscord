import { updateMembersServerByInviteCode } from '@/actions/server'
import { redirect } from 'next/navigation'

interface InviteCodePageProps {
  params: {
    inviteCode: string
  }
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  if (!params.inviteCode) {
    return redirect('/')
  }

  const server = await updateMembersServerByInviteCode(params.inviteCode)

  if (!server) {
    return redirect('/')
  }

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return redirect('/')
  }

  return redirect(`/servers/${server.id}/channels/${initialChannel?.id}`)
}

export default InviteCodePage
