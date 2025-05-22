import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from '@/types'
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH") {
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
      return res.status(404).json({ error: "Friend request not found" });
    }

    // Check if the user is the receiver of the friend request
    if (friend.userTwoId !== userId) {
      return res.status(403).json({ error: "You can only accept friend requests sent to you" });
    }

    const updatedFriend = await db.friend.update({
      where: {
        id: friendId as string,
      },
      data: {
        status: "ACCEPTED",
      },
      include: {
        userOne: true,
        userTwo: true,
      },
    });

    // Emit socket event to both users
    if (res.socket.server.io) {
      res.socket.server.io.to(friend.userOneId).emit("friend:update", updatedFriend);
      res.socket.server.io.to(friend.userTwoId).emit("friend:update", updatedFriend);
    }

    return res.status(200).json(updatedFriend);
  } catch (error) {
    console.log("[FRIEND_ACCEPT]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
