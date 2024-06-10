import { db } from '@/lib/db'

export const getConversationsByUserId = async (userId: string) => {
  try {
    const members = await db.member.findMany({
      where: {
        userId,
      },
    })

    if (!members) {
      throw new Error('Members not found')
    }

    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          {
            memberOneId: {
              in: members.map(member => member.id),
            },
          },
          {
            memberTwoId: {
              in: members.map(member => member.id),
            },
          },
        ],
      },

      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    })

    return conversations
  } catch {
    throw new Error('Internal Error')
  }
}

export const getFirstConversationsByUserId = async (userId: string) => {
  try {
    const members = await db.member.findMany({
      where: {
        userId,
      },
    })

    if (!members) {
      throw new Error('Members not found')
    }

    const [conversation] = await db.conversation.findMany({
      where: {
        OR: [
          {
            memberOneId: {
              in: members.map(member => member.id),
            },
          },
          {
            memberTwoId: {
              in: members.map(member => member.id),
            },
          },
        ],
      },

      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
      take: 1,
    })

    return conversation
  } catch {
    throw new Error('Internal Error')
  }
}
