'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { DirectMessage } from '@prisma/client';


const DIRECT_MESSAGES_BATCH = 10

export const getDirectMessageByConversationId = async ({
  cursor,
  conversationId,
}: {
  cursor: string | undefined
  conversationId: string
}) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    if (!conversationId) {
      throw new Error('Conversation ID missing')
    }

    let directMessages: DirectMessage[] = []

    if (cursor) {
      directMessages = await db.directMessage.findMany({
        take: DIRECT_MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      directMessages = await db.directMessage.findMany({
        take: DIRECT_MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }


    let nextCursor = null

    if (directMessages.length === DIRECT_MESSAGES_BATCH) {
      nextCursor = directMessages[DIRECT_MESSAGES_BATCH - 1].id
    }

    return {
      items: directMessages,
      nextCursor,
    }
  } catch {
    return {
      items: [],
      nextCursor: null,
    }
  }
}