import { findConversation } from '@/data/conversation'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const user = await currentUser()
    const { conversationId } = await context.params

    if (!user || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!conversationId) {
      return new NextResponse('Target conversation ID missing', { status: 400 })
    }

    const userOneId = user.id

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
    })

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 })
    }

    let currentHiddenConversation = await db.hiddenConversation.findFirst({
      where: {
        userId: userOneId,
        hiddenUserId:
          conversation.userOneId === userOneId
            ? conversation.userTwoId
            : conversation.userOneId,
        conversationId: conversation.id,
      },
    })

    if (!currentHiddenConversation) {
      currentHiddenConversation = await db.hiddenConversation.create({
        data: {
          userId: userOneId,
          hiddenUserId:
            conversation.userOneId === userOneId
              ? conversation.userTwoId
              : conversation.userOneId,
          conversationId: conversation.id,
          isActive: false,
        },
      })
    } else {
      await db.hiddenConversation.update({
        where: {
          id: currentHiddenConversation.id,
        },
        data: {
          isActive: false,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('[USER_CONVERSATION_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
