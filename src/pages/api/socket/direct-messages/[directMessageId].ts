import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'
import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { directMessageId, conversationId } = req.query
    const { content, user } = req.body


    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' })
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
    })

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        user: true,
      },
    })

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }

    const isMessageOwner = directMessage.userId === user.id
    // const isAdmin = member.role === MemberRole.ADMIN
    // const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner 

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          deleted: true,
        },
        include: {
          user: true,
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          user: true,
        },
      })
    }

    const updateKey = `chat:${conversation.id}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log('[MESSAGE_ID]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
