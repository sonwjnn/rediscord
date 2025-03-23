import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    const receivedUser = await db.user.findUnique({
      where: {
        name: username
      },
      select: {
        id: true,
        name: true
      }
    });
    
    if (!receivedUser) {
      return res.status(404).json({ 
        error: "Hm, didn't work. Double check that username is correct" 
      });
    }
    
    // Check if the user is trying to add themselves
    if (userId === receivedUser.id) {
      return res.status(400).json({
        error: "You cannot send a friend request to yourself"
      });
    }
    
    const existingReqOrFriend = await db.friend.findUnique({
      where: {
        userOneId_userTwoId: {
          userOneId: userId as string,
          userTwoId: receivedUser.id,
        }
      }
    });
    
    if (existingReqOrFriend) {
      const isFriend = existingReqOrFriend.status === "ACCEPTED";
      const isPendingReq = existingReqOrFriend.status === "PENDING";
      const isRejected = existingReqOrFriend.status === "REJECTED";
      
      if (isFriend) {
        return res.status(400).json({
          error: `This user ${receivedUser.name} is already in your friends list`
        });
      }
      
      if (isPendingReq) {
        return res.status(400).json({
          error: "Your friend request has been sent."
        });
      }
      
      if (isRejected) {
        return res.status(400).json({
          error: "Your friend request has been rejected."
        });
      }
    }
    
    // Also check in reverse direction (if they already sent a request to you)
    const reverseRequest = await db.friend.findUnique({
      where: {
        userOneId_userTwoId: {
          userOneId: receivedUser.id,
          userTwoId: userId as string,
        }
      }
    });
    
    if (reverseRequest) {
      return res.status(400).json({
        error: "This user has already sent you a friend request. Please check your pending requests."
      });
    }
    
    const data = await db.friend.create({
      data: {
        userOneId: userId as string,
        userTwoId: receivedUser.id,
        status: "PENDING"
      }
    });
    
    return res.status(200).json({ 
      success: "You have successfully sent a friend request.",
      request: data
    });
  } catch (error) {
    console.log("[FRIEND_SEND]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
} 