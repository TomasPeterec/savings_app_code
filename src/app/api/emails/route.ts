import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { adminAuth } from "@/firebase/admin"

const prisma = new PrismaClient()

interface RequestBody {
  email: string
  displayName?: string | null
}

export async function POST(req: Request) {
  try {
    // 1. Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // 2. Extract Bearer token
    const token = authHeader.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }

    // 3. Verify token
    const decodedToken = await adminAuth.verifyIdToken(token)
    if (!decodedToken) {
      console.log("No valid token")
    }

    // 4. Parse body
    const { email } = (await req.json()) as RequestBody;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userOfEmail = await prisma.user.findFirst({
      where: { email }
    })
    
    // 7. Return JSON response
    return NextResponse.json({
      userEmail: userOfEmail?.email
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/emails:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
