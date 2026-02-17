// app/api/save-subscription/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { adminAuth } from "@/firebase/admin" // use centralized Firebase Admin

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    // 1️ Parse the push subscription from request body
    const subscription = await req.json()

    // 2️ Get Firebase ID token from Authorization header
    const authHeader = req.headers.get("Authorization") || ""
    const token = authHeader.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    // 3️ Verify the token and get the real user ID
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // 4️Save subscription to Neon DB linked to this user
    await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    })

    console.log(`Saved subscription for user: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to save subscription:", err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
