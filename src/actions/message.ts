'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { Message, ServerReaction } from '@prisma/client'

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

    const reactions = await db.serverReaction.findMany({
      where: {
        messageId: {
          in: messages.map(message => message.id),
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
          existingReaction.memberIds = Array.from(
            new Set([...existingReaction.memberIds, reaction.memberId])
          )
        } else {
          acc.push({ ...reaction, memberIds: [reaction.memberId] })
        }
        return acc
      },
      [] as (ServerReaction & {
        count: number
        memberIds: string[]
      })[]
    )

    const reactionsWithoutMemberId = dedupedReactions.map(
      ({ memberId, ...rest }) => rest
    )

    const messageReactions = messages.map(message => ({
      ...message,
      reactions: reactionsWithoutMemberId.filter(
        reaction => reaction.messageId === message.id
      ),
    }))

    let nextCursor = null

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return {
      items: messageReactions,
      nextCursor,
    }
  } catch {
    return []
  }
}
