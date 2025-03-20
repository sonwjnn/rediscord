import { db } from '@/lib/db'

export const getConversationsByUserId = async (userId: string) => {
  try {
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { userOneId: userId },
          { userTwoId: userId },
        ],
      },

      include: {
        userOne: true,
        userTwo: true,
      },
    })

    return conversations
  } catch {
    throw new Error('Internal Error')
  }
}

export const getFirstConversationsByUserId = async (userId: string) => {
  try {
    const [conversation] = await db.conversation.findMany({
      where: {
        OR: [
          { userOneId: userId },
          { userTwoId: userId },
        ],
      },

      include: {
        userOne: true,
        userTwo: true,
      },
      take: 1,
    })

    return conversation
  } catch {
    throw new Error('Internal Error')
  }
}
