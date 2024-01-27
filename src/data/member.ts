import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const getCurrentMemberOfServer = async (serverId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const member = await db.member.findFirst({
      where: {
        serverId,
        userId: user.id,
      },
    })
    return member
  } catch (error) {
    return null
  }
}

export const getCurrentMemberOfServerWithUser = async (serverId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const member = await db.member.findFirst({
      where: {
        serverId,
        userId: user.id,
      },
      include: {
        user: true,
      },
    })
    return member
  } catch (error) {
    return null
  }
}
