import { updateMembersServerByInviteCode } from '@/actions/server'
import { redirect } from 'next/navigation'

const InviteCodePage = async ({
  params,
}: {
  params: Promise<{ inviteCode: string }>
}) => {
  const { inviteCode } = await params

  if (!inviteCode) {
    return redirect('/')
  }

  const server = await updateMembersServerByInviteCode(inviteCode)

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
