import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { friendId: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { friendId } = params

    if (!friendId) {
      return new NextResponse("Friend ID is required", { status: 400 })
    }

    const friendRequest = await db.friend.findUnique({
      where: {
        id: friendId
      }
    })

    if (!friendRequest) {
      return new NextResponse("Friend request not found", { status: 404 })
    }

    if (friendRequest.userOneId !== userId) {
      return new NextResponse("Not authorized to cancel this request", { status: 403 })
    }

    if (friendRequest.status !== "PENDING") {
      return new NextResponse("Can only cancel pending friend requests", { status: 400 })
    }

    const deletedRequest = await db.friend.delete({
      where: {
        id: friendId
      }
    })

    if (!deletedRequest) {
      return new NextResponse("Something went wrong when canceling friend request", { status: 500 })
    }

    return NextResponse.json({ success: "Friend request canceled successfully" })
  } catch (error) {
    console.log("[FRIEND_CANCEL]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
