import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;
    const { friendId } = req.query;

    if (!userId || !friendId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const friend = await db.friend.findUnique({
      where: {
        id: friendId as string,
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    });

    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    // Check if the user is one of the friends
    if (friend.userOneId !== userId && friend.userTwoId !== userId) {
      return res.status(403).json({ error: "You can only delete your own friends" });
    }

    // Store friend data before deletion for socket event
    const deletedFriend = { ...friend };

    // Delete the friend
    await db.friend.delete({
      where: {
        id: friendId as string,
      },
    });

    // Emit socket event to both users
    if (res.socket.server.io) {
      res.socket.server.io.to(friend.userOneId).emit("friend:update", { ...deletedFriend, status: "DELETED" });
      res.socket.server.io.to(friend.userTwoId).emit("friend:update", { ...deletedFriend, status: "DELETED" });
    }

    return res.status(200).json({ success: "Friend deleted successfully" });
  } catch (error) {
    console.log("[FRIEND_DELETE]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
} 