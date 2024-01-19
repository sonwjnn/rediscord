'use server'

import { currentProfile } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const onKick = async (serverId: string, memberId: string) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
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
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
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
    const profile = await currentProfile()

    if (!profile) {
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
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
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
            profile: true,
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
