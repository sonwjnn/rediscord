"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export const sendFriendReq = async (username: string) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  const receivedUser = await db.user.findUnique({
    where: {
      name: username
    },
    select: {
      id: true,
      name: true
    }
  })

  if(!receivedUser) {
    return { error: "Hm, didn't work. Double check that username is correct" }
  }

  const existingReqOrFriend = await db.friend.findUnique({
    where: {
      userOneId_userTwoId: {
        userOneId: user.id,
        userTwoId: receivedUser.id,
      }
    }
  })

  if(existingReqOrFriend) {
    const isFriend = existingReqOrFriend.status === "ACCEPTED"
    const isPendingReq = existingReqOrFriend.status === "PENDING"
    const isRejected = existingReqOrFriend.status === "REJECTED"

    if(isFriend) {
      return { error: `This user ${receivedUser.name} is already in your friends list` }
    }

    if(isPendingReq) {
      return { error: "Your friend request has been sent." }
    }

    if(isRejected) {
      return { error: "Your friend request has been rejected." }
    }
  }


  const data = await db.friend.create({
    data: {
      userOneId: user.id,
      userTwoId: receivedUser.id,
      status: "PENDING"
    }
  })

  if(!data) {
    return { error: `Something went wrong when add ${receivedUser.name}` }
  }

  revalidatePath('/me?tabs=PENDING')
  return { success: "You have successfully sent a friend request." }
}

export const acceptFriendReq = async (friendId: string) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  const friendRequest = await db.friend.findUnique({
    where: {
      id: friendId
    }
  })

  if (!friendRequest) {
    return { error: "Friend request not found" }
  }

  if (friendRequest.userTwoId !== user.id) {
    return { error: "Not authorized to accept this request" }
  }

  const updatedFriend = await db.friend.update({
    where: {
      id: friendId
    },
    data: {
      status: "ACCEPTED"
    }
  })

  if (!updatedFriend) {
    return { error: "Something went wrong when accepting friend request" }
  }

  revalidatePath('/me?tabs=ALL')
  revalidatePath('/me?tabs=ONLINE')
  revalidatePath('/me?tabs=PENDING')

  return { success: "Friend request accepted successfully" }
}

export const rejectFriendReq = async (friendId: string) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  const friendRequest = await db.friend.findUnique({
    where: {
      id: friendId
    }
  })

  if (!friendRequest) {
    return { error: "Friend request not found" }
  }

  if (friendRequest.userTwoId !== user.id) {
    return { error: "Not authorized to reject this request" }
  }

  const updatedFriend = await db.friend.update({
    where: {
      id: friendId
    },
    data: {
      status: "REJECTED"
    }
  })

  if (!updatedFriend) {
    return { error: "Something went wrong when rejecting friend request" }
  }

  revalidatePath('/me?tabs=PENDING')

  return { success: "Friend request rejected successfully" }
}

export const cancelFriendReq = async (friendId: string) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  const friendRequest = await db.friend.findUnique({
    where: {
      id: friendId
    }
  })

  if (!friendRequest) {
    return { error: "Friend request not found" }
  }

  if (friendRequest.userOneId !== user.id) {
    return { error: "Not authorized to cancel this request" }
  }

  if (friendRequest.status !== "PENDING") {
    return { error: "Can only cancel pending friend requests" }
  }

  const deletedRequest = await db.friend.delete({
    where: {
      id: friendId
    }
  })

  if (!deletedRequest) {
    return { error: "Something went wrong when canceling friend request" }
  }

  revalidatePath('/me?tabs=PENDING')

  return { success: "Friend request canceled successfully" }
}

export const deleteFriend = async (friendId: string) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  const friendship = await db.friend.findUnique({
    where: {
      id: friendId
    }
  })

  if (!friendship) {
    return { error: "Friend not found" }
  }

  // Verify the user is part of this friendship
  if (friendship.userOneId !== user.id && friendship.userTwoId !== user.id) {
    return { error: "Not authorized to delete this friendship" }
  }

  // Verify it's an accepted friendship
  if (friendship.status !== "ACCEPTED") {
    return { error: "Can only delete accepted friendships" }
  }

  const deletedFriendship = await db.friend.delete({
    where: {
      id: friendId
    }
  })

  if (!deletedFriendship) {
    return { error: "Something went wrong when deleting friend" }
  }

  revalidatePath('/me?tabs=ALL')
  revalidatePath('/me?tabs=ONLINE')

  return { success: "Friend removed successfully" }
}