import { db } from '@/lib/db'



export const findConversation = async (userOneId: string, userTwoId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ userOneId: userOneId }, { userTwoId: userTwoId }],
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    })

    if(!conversation) {
      return null
    }

    const hiddenConversationData = await db.hiddenConversation.findFirst({
      where: {
        conversationId: conversation.id,
        userId: userOneId,
        hiddenUserId: userTwoId
      }
    })


    if(hiddenConversationData && hiddenConversationData?.isActive === false) {
      await db.hiddenConversation.update({
        where: {
          id: hiddenConversationData.id
        },
        data: {
          isActive: true
        }
      })
    }

    return conversation
  } catch {
    return null
  }
}
