'use server'

import { currentProfile } from '@/lib/auth'
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
  const profile = await currentProfile()

  if (!profile) {
    return { error: 'Unauthorized!' }
  }

  const server = await db.server.create({
    data: {
      ...validatedFields.data,
      profileId: profile.id,
      name,
      image,
      inviteCode: uuidv4(),
      channels: {
        create: [{ name: 'general', profileId: profile.id }],
      },
      members: {
        create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
      },
    },
  })

  revalidatePath(`/server/${server.id}`)

  return server
}

export const newInviteCode = async (serverId: string) => {
  const profile = await currentProfile()

  if (!profile) {
    throw new Error('Unauthorized')
  }

  if (!serverId) {
    throw new Error('Server Id is missing')
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
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
  const profile = await currentProfile()

  if (!profile) {
    return { error: 'Unauthorized!' }
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      name,
      image,
    },
  })

  revalidatePath(`/server/${server.id}`)

  return server
}

export const updateMembersServerByInviteCode = async (inviteCode: string) => {
  const profile = await currentProfile()

  if (!profile) {
    throw new Error('Unauthorized')
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
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
            profileId: profile.id,
          },
        ],
      },
    },
  })

  revalidatePath(`/server/${server.id}`)
  return server
}
