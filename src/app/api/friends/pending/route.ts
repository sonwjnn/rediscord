import { auth } from "@/auth"
import { getPendingRequestsByUserId } from "@/data/friend"
import { NextResponse } from "next/server"

export async function GET(
  req: Request
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const friends = await getPendingRequestsByUserId(userId)

    return NextResponse.json(friends)
  } catch (error) {
    console.log("[FRIENDS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

