import { NextResponse } from "next/server"
import { getOtherUserByUsername } from "@/data/user"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
    const userId = searchParams.get("userId")

    if (!userId) {
      return new NextResponse("UserId is required", { status: 400 })
    }

    if (!username) {
      return new NextResponse("Username is required", { status: 400 })
    }

    const user = await getOtherUserByUsername(userId, username)

    return NextResponse.json(user)
  } catch (error) {
    console.log("[USER_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
