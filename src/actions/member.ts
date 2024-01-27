'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const onKick = async (serverId: string, memberId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    if (!serverId) {
      throw new Error('Server ID missing')
    }

    if (!memberId) {
      throw new Error('Member ID missing')
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            userId: {
              not: user.id,
            },
          },
        },
      },
      include: {
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
    revalidatePath(`/servers/${server.id}`)

    return server
  } catch {
    throw new Error('Internal Error')
  }
}

export const onRoleChange = async (
  serverId: string,
  memberId: string,
  role: MemberRole
) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    if (!serverId) {
      throw new Error('Server ID missing')
    }

    if (!memberId) {
      throw new Error('Member ID missing')
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              userId: {
                not: user.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    revalidatePath(`/servers/${server.id}`)

    return server
  } catch {
    throw new Error('Internal Error')
  }
}
