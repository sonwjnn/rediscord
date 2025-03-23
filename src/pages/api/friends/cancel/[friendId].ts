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

    const friendRequest = await db.friend.findUnique({
      where: {
        id: friendId
      }
    });

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (friendRequest.userOneId !== userId) {
      return res.status(403).json({ error: "Not authorized to cancel this request" });
    }

    if (friendRequest.status !== "PENDING") {
      return res.status(400).json({ error: "Can only cancel pending friend requests" });
    }

    const deletedRequest = await db.friend.delete({
      where: {
        id: friendId
      }
    });

    if (!deletedRequest) {
      return res.status(500).json({ error: "Something went wrong when canceling friend request" });
    }

    return res.status(200).json({ success: "Friend request canceled successfully" });
  } catch (error) {
    console.log("[FRIEND_CANCEL]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
