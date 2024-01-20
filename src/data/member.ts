import { currentProfile } from '@/lib/auth'
import { db } from '@/lib/db'

export const getCurrentMemberOfServer = async (serverId: string) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      throw new Error('Unauthorized')
    }

    const member = await db.member.findFirst({
      where: {
        serverId,
        profileId: profile.id,
      },
    })
    return member
  } catch (error) {
    return null
  }
}

export const getCurrentMemberOfServerWithProfile = async (serverId: string) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      throw new Error('Unauthorized')
    }

    const member = await db.member.findFirst({
      where: {
        serverId,
        profileId: profile.id,
      },
      include: {
        profile: true,
      },
    })
    return member
  } catch (error) {
    return null
  }
}
