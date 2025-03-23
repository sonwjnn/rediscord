import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { friendId, userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!friendId || typeof friendId !== "string") {
      return res.status(400).json({ error: "Friend ID is required" });
    }

    const friendship = await db.friend.findUnique({
      where: {
        id: friendId
      }
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friend not found" });
    }

    // Verify the user is part of this friendship
    if (friendship.userOneId !== userId && friendship.userTwoId !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this friendship" });
    }

    // Verify it's an accepted friendship
    if (friendship.status !== "ACCEPTED") {
      return res.status(400).json({ error: "Can only delete accepted friendships" });
    }

    const deletedFriendship = await db.friend.delete({
      where: {
        id: friendId
      }
    });

    if (!deletedFriendship) {
      return res.status(500).json({ error: "Something went wrong when deleting friend" });
    }

    return res.status(200).json({ success: "Friend removed successfully" });
  } catch (error) {
    console.log("[FRIEND_DELETE]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
} 