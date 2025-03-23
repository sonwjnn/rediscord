import { auth } from "@/auth"
import { deleteFriend } from "@/actions/friend";
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

    const result = await deleteFriend(friendId)

    if (result.error) {
      return new NextResponse(result.error, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.log("[FRIEND_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 