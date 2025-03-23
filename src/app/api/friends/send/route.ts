import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  req: Request
) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const { username } = await req.json()
    
    if (!username) {
      return new NextResponse("Username is required", { status: 400 })
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
    
    if (!receivedUser) {
      return new NextResponse(
        "Hm, didn't work. Double check that username is correct", 
        { status: 404 }
      )
    }
    
    // Check if the user is trying to add themselves
    if (userId === receivedUser.id) {
      return new NextResponse(
        "You cannot send a friend request to yourself", 
        { status: 400 }
      )
    }
    
    const existingReqOrFriend = await db.friend.findUnique({
      where: {
        userOneId_userTwoId: {
          userOneId: userId,
          userTwoId: receivedUser.id,
        }
      }
    })
    
    if (existingReqOrFriend) {
      const isFriend = existingReqOrFriend.status === "ACCEPTED"
      const isPendingReq = existingReqOrFriend.status === "PENDING"
      const isRejected = existingReqOrFriend.status === "REJECTED"
      
      if (isFriend) {
        return new NextResponse(
          `This user ${receivedUser.name} is already in your friends list`, 
          { status: 400 }
        )
      }
      
      if (isPendingReq) {
        return new NextResponse(
          "Your friend request has been sent.", 
          { status: 400 }
        )
      }
      
      if (isRejected) {
        return new NextResponse(
          "Your friend request has been rejected.", 
          { status: 400 }
        )
      }
    }
    
    // Also check in reverse direction (if they already sent a request to you)
    const reverseRequest = await db.friend.findUnique({
      where: {
        userOneId_userTwoId: {
          userOneId: receivedUser.id,
          userTwoId: userId,
        }
      }
    })
    
    if (reverseRequest) {
      return new NextResponse(
        "This user has already sent you a friend request. Please check your pending requests.", 
        { status: 400 }
      )
    }
    
    const data = await db.friend.create({
      data: {
        userOneId: userId,
        userTwoId: receivedUser.id,
        status: "PENDING"
      }
    })
    
    return NextResponse.json({ 
      success: "You have successfully sent a friend request.",
      request: data
    })
  } catch (error) {
    console.log("[FRIEND_SEND]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 