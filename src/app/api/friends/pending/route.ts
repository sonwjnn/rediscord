import { auth } from "@/auth"
import { getPendingRequestsByUserId } from "@/data/friend"
import { NextResponse } from "next/server"

export async function GET(
  req: Request
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }

    const friends = await getPendingRequestsByUserId(userId)

    return NextResponse.json(friends)
  } catch (error) {
    console.log("[FRIENDS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

