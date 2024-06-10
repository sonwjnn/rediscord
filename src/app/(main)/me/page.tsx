import { getFirstConversationsByUserId } from '@/data/direct-message'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

const MeLayout = async () => {
  const user = await currentUser()

  if (!user || !user.id) {
    return redirect('/auth/login')
  }

  const conversation = await getFirstConversationsByUserId(user.id)

  if (!conversation) {
    return
  }

  const otherMember =
    conversation.memberOne.userId === user.id
      ? conversation.memberTwo
      : conversation.memberOne

  return redirect(`/me/${otherMember.serverId}/${otherMember.id}`)
}

export default MeLayout
