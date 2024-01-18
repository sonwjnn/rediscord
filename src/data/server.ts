import { currentProfile } from '@/lib/auth'
import { db } from '@/lib/db'

export const getServerById = async (serverId: string) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      throw new Error('Unauthorized')
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    })
    return server
  } catch {
    throw new Error('Internal Error')
  }
}

export const getServerWithChannelsById = async (serverId: string) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      throw new Error('Unauthorized')
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
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
    return server
  } catch {
    throw new Error('Internal Error')
  }
}

export const getServerWithChannelsWithMembers = async (serverId: string) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      throw new Error('Unauthorized')
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })
    return server
  } catch {
    throw new Error('Internal Error')
  }
}

export const getSeversByProfileId = async (profileId: string) => {
  try {
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    })
    return servers
  } catch {
    throw new Error('Internal Error')
  }
}
