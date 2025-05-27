import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'
import { ConversationReaction } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { directMessageId } = req.query
    const { emoji, userId } = req.body

    if (!directMessageId) {
      return res.status(400).json({ error: 'Direct Message ID missing' })
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

    const message = await db.directMessage.findUnique({
      where: {
        id: directMessageId as string,
      },
    })

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    const existingReaction = await db.conversationReaction.findFirst({
      where: {
        messageId: message.id,
        emoji,
        userId: currentUser.id,
      },
    })

    let reaction: ConversationReaction | null = null

    if (existingReaction) {
      reaction = await db.conversationReaction.delete({
        where: {
          id: existingReaction.id,
        },
      })
    } else {
      reaction = await db.conversationReaction.create({
        data: {
          messageId: message.id,
          emoji,
          userId: currentUser.id,
        },
      })
    }

    const type = existingReaction ? 'remove' : 'add'
    const key = `direct-message:${message.id}:reaction:${type}`

    res?.socket?.server?.io?.emit(key, {
      messageId: message.id,
      reactionId: reaction?.id,
      emoji,
      userId: currentUser.id,
    })

    return res.status(200).json({ reactionId: reaction?.id, type })
  } catch (error) {
    console.log('[DIRECT_MESSAGES_REACTIONS_POST]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}
