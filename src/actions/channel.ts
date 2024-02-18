'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ChannelSchema } from '@/schemas'
import { MemberRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

export const createChannel = async (
  values: z.infer<typeof ChannelSchema>,
  serverId: string
) => {
  const validatedFields = ChannelSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { name, type } = validatedFields.data

  const user = await currentUser()

  if (!user?.id) {
    throw new Error('Unauthorized')
  }

  if (!serverId) {
    throw new Error('Server ID missing')
  }

  if (name === 'general') {
    throw new Error("Name cannot be 'general'")
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      channels: {
        create: {
          userId: user.id,
          name,
          type,
        },
      },
    },
  })

  revalidatePath(`/servers/${server.id}`)

  return server
}

export const editChannel = async (
  values: z.infer<typeof ChannelSchema>,
  serverId: string,
  channelId: string
) => {
  const validatedFields = ChannelSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { name, type } = validatedFields.data

  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!serverId) {
    throw new Error('Server ID missing')
  }

  if (!channelId) {
    throw new Error('Channel ID missing')
  }

  if (name === 'general') {
    throw new Error("Name cannot be 'general'")
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      channels: {
        update: {
          where: {
            id: channelId,
            NOT: {
              name: 'general',
            },
          },
          data: {
            name,
            type,
          },
        },
      },
    },
  })

  revalidatePath(`/servers/${serverId}`)
  revalidatePath(`/servers/${serverId}/channels/${channelId}`)

  return server
}

export const deleteChannel = async (serverId: string, channelId: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!serverId) {
    throw new Error('Server ID missing')
  }

  if (!channelId) {
    throw new Error('Channel ID missing')
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      channels: {
        delete: {
          id: channelId,
          name: {
            not: 'general',
          },
        },
      },
    },
  })

  revalidatePath(`/servers/${serverId}`)

  return server
}
