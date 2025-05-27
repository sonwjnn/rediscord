import { db } from '@/lib/db'

export const getServerReactions = async (messageId: string) => {
  try {
    const reactions = await db.serverReaction.findMany({
      where: {
        messageId,
      },
    })

    return reactions
  } catch (error) {
    console.log('[GET_SERVER_REACTIONS]', error)
    return []
  }
}

export const getDirectMessageReactions = async (messageId: string) => {
  try {
    const reactions = await db.conversationReaction.findMany({
      where: {
        messageId,
      },
    })

    return reactions
  } catch (error) {
    console.log('[GET_DIRECT_MESSAGE_REACTIONS]', error)
    return []
  }
}
