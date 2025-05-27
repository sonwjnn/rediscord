import { findConversation } from '@/data/conversation'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  context: { params: Promise<{ userTwoId: string }> }
) {
  try {
    const user = await currentUser()
    const { userTwoId } = await context.params

    if (!user || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!userTwoId) {
      return new NextResponse('Target user ID missing', { status: 400 })
    }

    let conversation =
      (await findConversation(user.id, userTwoId)) ||
      (await findConversation(userTwoId, user.id))

    if (!conversation) {
      const newConversation = await db.conversation.create({
        data: {
          userOneId: user.id,
          userTwoId,
        },
        include: {
          userOne: true,
          userTwo: true,
        },
      })

      return NextResponse.json(newConversation)
    }

    const currentHiddenConversation = await db.hiddenConversation.findFirst({
      where: {
        conversationId: conversation.id,
        userId: user.id,
        hiddenUserId: userTwoId,
      },
    })

    if (
      currentHiddenConversation &&
      currentHiddenConversation.isActive === false
    ) {
      await db.hiddenConversation.update({
        where: {
          id: currentHiddenConversation.id,
        },
        data: {
          isActive: true,
        },
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.log('[USER_CONVERSATION_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
