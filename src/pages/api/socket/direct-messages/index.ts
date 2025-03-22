import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { content, fileUrl, user } = req.body
    const { conversationId } = req.query

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' })
    }

    if (!content && !fileUrl) {
      return res.status(400).json({ error: 'Content missing' })
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            userOne: {
              is: { id: user.id }
            }
          },
          {
            userTwo: {
              is: { id: user.id }
            }
          }
        ]
      },
      include: {
        userOne: true,
        userTwo: true
      }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        userId: user.id,
      },
      include: {
        user: true,
      },
    })

    const channelKey = `chat:${conversationId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[DIRECT_MESSAGES_POST]', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}
