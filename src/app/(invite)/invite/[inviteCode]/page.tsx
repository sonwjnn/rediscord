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

  if (server) {
    return redirect(`/servers/${server?.id}`)
  }

  return null
}

export default InviteCodePage
