// src/app/api/users/route.ts
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
    // 1. Get Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // 2. Extract Bearer token
    const token = authHeader.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }

    // 3. Verify token with Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token)
    const firebaseUid = decodedToken.uid

    // 4. Parse request body
    const { email, displayName } = (await req.json()) as RequestBody

    // 5. Upsert user in PostgreSQL via Prisma (displayName can be null)
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { email, displayName },
      create: { firebaseUid, email, displayName },
    })

    // 6. Return the user as JSON
    return NextResponse.json({ user })
  } catch (error: unknown) {
    // Safety: narrow unknown error
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/users:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
