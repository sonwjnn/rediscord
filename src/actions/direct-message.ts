'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ConversationReaction, DirectMessage } from '@prisma/client'

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

    const reactions = await db.conversationReaction.findMany({
      where: {
        messageId: {
          in: directMessages.map(message => message.id),
        },
      },
    })

    const reactionsWithCounts = reactions.map(reaction => {
      return {
        ...reaction,
        count: reactions.filter(r => r.emoji === reaction.emoji).length,
      }
    })

    const dedupedReactions = reactionsWithCounts.reduce(
      (acc, reaction) => {
        const existingReaction = acc.find(r => r.emoji === reaction.emoji)

        if (existingReaction) {
          existingReaction.userIds = Array.from(
            new Set([...existingReaction.userIds, reaction.userId])
          )
        } else {
          acc.push({ ...reaction, userIds: [reaction.userId] })
        }
        return acc
      },
      [] as (ConversationReaction & {
        count: number
        userIds: string[]
      })[]
    )

    const reactionsWithoutUserId = dedupedReactions.map(
      ({ userId, ...rest }) => rest
    )

    const messageReactions = directMessages.map(message => ({
      ...message,
      reactions: reactionsWithoutUserId.filter(
        reaction => reaction.messageId === message.id
      ),
    }))

    let nextCursor = null

    if (directMessages.length === DIRECT_MESSAGES_BATCH) {
      nextCursor = directMessages[DIRECT_MESSAGES_BATCH - 1].id
    }

    return {
      items: messageReactions,
      nextCursor,
    }
  } catch {
    return {
      items: [],
      nextCursor: null,
    }
  }
}
