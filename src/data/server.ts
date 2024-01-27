import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const getServerById = async (serverId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            userId: user.id,
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
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId,
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
    return server
  } catch {
    throw new Error('Internal Error')
  }
}

export const getServerWithChannelsWithMembers = async (serverId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
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
            user: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })
    return server
  } catch {
    return null
  }
}

export const getSeversByuserId = async (userId: string) => {
  try {
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            userId,
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
    return servers
  } catch {
    return null
  }
}
