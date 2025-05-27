import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await currentUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ userOneId: user.id }, { userTwoId: user.id }],
        NOT: {
          hiddenConversations: {
            some: {
              userId: user.id,
              isActive: false,
            },
          },
        },
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.log('[USER_CONVERSATIONS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
