import { db } from '@/lib/db'

export const getOrCreateConversation = async (
  userOneId: string,
  userTwoId: string
) => {
  let conversation =
    (await findConversation(userOneId, userTwoId)) ||
    (await findConversation(userTwoId, userOneId))

  if (!conversation) {
    conversation = await createNewConversation(userOneId, userTwoId)
  }

  return conversation
}

const findConversation = async (userOneId: string, userTwoId: string) => {
  try {
    const data = await db.conversation.findFirst({
      where: {
        AND: [{ userOneId: userOneId }, { userTwoId: userTwoId }],
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    })

    if(!data) {
      return null
    }

    await db.conversation.update({
      where: {
        id: data.id
      },
      data: {
        isVisible: true
      }
    })

    return {
      ...data,
      isVisible: true
    }
  } catch {
    return null
  }
}

const createNewConversation = async (
  userOneId: string,
  userTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        userOneId,
        userTwoId,
        isVisible: true
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    })
  } catch {
    return null
  }
}
