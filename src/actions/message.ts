'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { Message } from '@prisma/client'

const MESSAGES_BATCH = 10

export const getMessagesByChannelId = async ({
  cursor,
  channelId,
}: {
  cursor: string | undefined
  channelId: string
}) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    if (!channelId) {
      throw new Error('Channel ID missing')
    }

    let messages: Message[] = []

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor = null

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return {
      items: messages,
      nextCursor,
    }
  } catch {
    return []
  }
}
