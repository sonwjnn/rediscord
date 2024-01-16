import { db } from '@/lib/db'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        stream: true,
      },
    })
    return user
  } catch (error) {
    return null
  }
}

export const getUserByUsername = async (name: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
        stream: {
          select: {
            id: true,
            isLive: true,
            isChatDelayed: true,
            isChatEnabled: true,
            isChatFollowersOnly: true,
            thumbnailUrl: true,
            name: true,
          },
        },
        _count: {
          select: {
            followedBy: true,
          },
        },
      },
    })

    return user
  } catch (error) {
    return null
  }
}
