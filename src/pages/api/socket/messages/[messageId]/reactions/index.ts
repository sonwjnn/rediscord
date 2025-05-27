import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'
import { ServerReaction } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messageId } = req.query
    const { emoji, userId, serverId } = req.body
    if (!messageId) {
      return res.status(400).json({ error: 'Message ID missing' })
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const currentUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    })

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const message = await db.message.findUnique({
      where: {
        id: messageId as string,
      },
    })

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    const member = await db.member.findFirst({
      where: {
        userId: currentUser.id,
        serverId,
      },
    })

    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const existingReaction = await db.serverReaction.findFirst({
      where: {
        messageId: message.id,
        emoji,
        memberId: member.id,
        serverId,
      },
    })

    let reaction: ServerReaction | null = null

    if (existingReaction) {
      reaction = await db.serverReaction.delete({
        where: {
          id: existingReaction.id,
        },
      })
    } else {
      reaction = await db.serverReaction.create({
        data: {
          messageId: message.id,
          emoji,
          memberId: member.id,
          serverId: member.serverId,
        },
      })
    }

    const type = existingReaction ? 'remove' : 'add'
    const key = `message:${message.id}:reaction:${type}`

    res?.socket?.server?.io?.emit(key, {
      messageId: message.id,
      reactionId: reaction?.id,
      emoji,
      memberId: member.id,
    })

    return res.status(200).json({ reactionId: reaction?.id, type })
  } catch (error) {
    console.log('[MESSAGES_REACTIONS_POST]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}
