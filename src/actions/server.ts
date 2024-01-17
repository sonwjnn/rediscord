'use server'

import { currentProfile } from '@/lib/auth'
import { db } from '@/lib/db'
import { ServerSchema } from '@/schemas'
import { MemberRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'
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
