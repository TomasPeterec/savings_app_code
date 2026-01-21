import { NextResponse } from "next/server"
import { adminAuth } from "@/firebase/admin"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface ItemData {
  uuid: string
  name: string
}

export async function GET(req: Request) {
  try {
    // Get Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Extract Bearer token
    const token = authHeader.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }

    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token)
    const firebaseUid = decodedToken.uid
    console.log("Decoded Firebase UID:", firebaseUid)
    if (!firebaseUid) {
      return NextResponse.json({ error: "Invalid user token" }, { status: 401 })
    }

    // Query savings for this user
    const listOfSavings = await prisma.savings.findMany({
      where: { userId: firebaseUid },
      select: { uuid: true, name: true },
    })

    console.log("List of savings fetched:", listOfSavings)

    // Debug: check if any savings exist for UID
    if (!listOfSavings || listOfSavings.length === 0) {
      console.warn(`No savings found for user ${firebaseUid}`)
      // Optional: return empty array explicitly
      return NextResponse.json([])
    }

    // Map to frontend-friendly type
    const savingsData: ItemData[] = listOfSavings.map(item => ({
      uuid: item.uuid,
      name: item.name,
    }))

    // Return JSON
    return NextResponse.json(savingsData)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings GET:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
