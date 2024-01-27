'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ServerSchema } from '@/schemas'
import { MemberRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

export const createServer = async (values: z.infer<typeof ServerSchema>) => {
  const validatedFields = ServerSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { name, image } = validatedFields.data
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized!' }
  }

  const server = await db.server.create({
    data: {
      ...validatedFields.data,
      userId: user.id,
      name,
      image,
      inviteCode: uuidv4(),
      channels: {
        create: [{ name: 'general', userId: user.id }],
      },
      members: {
        create: [{ userId: user.id, role: MemberRole.ADMIN }],
      },
    },
  })

  revalidatePath(`/servers/${server.id}`)

  return server
}

export const newInviteCode = async (serverId: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!serverId) {
    throw new Error('Server Id is missing')
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      userId: user.id,
    },
    data: {
      inviteCode: uuidv4(),
    },
  })

  return server
}

export const updateServer = async (
  values: z.infer<typeof ServerSchema>,
  serverId: string
) => {
  const validatedFields = ServerSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { name, image } = validatedFields.data
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized!' }
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      userId: user.id,
    },
    data: {
      name,
      image,
    },
  })

  revalidatePath(`/servers/${server.id}`)

  return server
}

export const updateMembersServerByInviteCode = async (inviteCode: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  })

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`)
  }

  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [
          {
            userId: user.id,
          },
        ],
      },
    },
    include: {
      channels: true,
    },
  })

  revalidatePath(`/servers/${server.id}`)
  return server
}

export const leaveServer = async (serverId: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!serverId) {
    throw new Error('Server Id is missing')
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      userId: {
        not: user.id,
      },
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    data: {
      members: {
        deleteMany: {
          userId: user.id,
        },
      },
    },
  })

  revalidatePath(`/servers/${server.id}`)
}

export const deleteServer = async (serverId: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!serverId) {
    throw new Error('Server Id is missing')
  }

  const server = await db.server.delete({
    where: {
      id: serverId,
      userId: user.id,
    },
  })

  revalidatePath(`/servers/${server.id}`)

  return server
}
