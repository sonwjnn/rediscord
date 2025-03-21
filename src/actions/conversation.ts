"use server";

import { findConversation } from "@/data/conversation";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";


export const hiddenConversation = async (userOneId:string, userTwoId: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  let conversation =
    (await findConversation(userOneId, userTwoId)) ||
    (await findConversation(userTwoId, userOneId))
    

  if (!conversation) {
    throw new Error('Conversation not found')
  }

  await createOrUpdateHiddenConversation(userOneId, userTwoId, conversation.id, false)

  revalidatePath('/me')
  revalidatePath(`/me/${userTwoId}`)
  revalidatePath(`/me/friends`)
}

export const createOrUpdateHiddenConversation = async (
  userOneId:string, 
  userTwoId: string, 
  conversationId: string, 
  isActive: boolean
) => {
  let currentHiddenConversation = await db.hiddenConversation.findFirst({
    where: {
      userId: userOneId,
      hiddenUserId: userTwoId,
      conversationId
    }
  })

  if(!currentHiddenConversation) {
    currentHiddenConversation = await db.hiddenConversation.create({
      data: {
        userId: userOneId,
        hiddenUserId: userTwoId,
        conversationId,
        isActive
      }
    })
  }

  await db.hiddenConversation.update({
    where: {
      id: currentHiddenConversation.id,
    },
    data: {
      isActive: false
    }
  })
}

export const getOrCreateConversation = async (
  userOneId: string,
  userTwoId: string
) => {
  const conversation =
    (await findConversation(userOneId, userTwoId)) ||
    (await findConversation(userTwoId, userOneId))

  if (!conversation) {
    const data = await createNewConversation(userOneId, userTwoId)

    return data
  }

  const currentHiddenConversation = await db.hiddenConversation.findFirst({
    where: {
      conversationId: conversation.id,
      userId: userOneId,
      hiddenUserId: userTwoId
    }
  })

  if(currentHiddenConversation) {
    if(currentHiddenConversation.isActive === false) {
      await db.hiddenConversation.update({
        where: {
          id: currentHiddenConversation.id,
        },
        data: {
          isActive: true,
        },
      })

      revalidatePath('/me')
      revalidatePath(`/me/${userTwoId}`)
      revalidatePath(`/me/friends`)
    }
  }

  return conversation
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