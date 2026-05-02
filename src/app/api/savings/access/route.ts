import { NextResponse } from "next/server"
import { adminAuth } from "@/firebase/admin"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface ItemData {
  uuid: string
  name: string
  shortName: string | null
}

export async function GET(req: Request) {
  try {
    // 1. Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 })

    // 2. Extract Bearer token
    const token = authHeader.split(" ")[1]
    if (!token) return NextResponse.json({ error: "Invalid token format" }, { status: 401 })

    // 3. Verify token
    const decodedToken = await adminAuth.verifyIdToken(token)
    const firebaseUid = decodedToken.uid
    if (!firebaseUid) return NextResponse.json({ error: "Invalid user token" }, { status: 401 })

    // 4. Get all saving UUIDs this user has access to
    const accessList = await prisma.savingAccess.findMany({
      where: { userId: firebaseUid },
      select: { savingUuid: true },
    })
    const savingUuids = accessList.map(a => a.savingUuid)
    if (!savingUuids.length) return NextResponse.json([])

    // 5. Get savings along with author info (user)
    const savings = await prisma.savings.findMany({
      where: { uuid: { in: savingUuids } },
      select: {
        uuid: true,
        name: true,
        user: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    })

    // 6. Map shortName from user info
    const savingsData: ItemData[] = savings.map(s => {
      const userObj = s.user
      let shortName: string | null = null
      const nameToUse =
        userObj?.displayName && userObj.displayName !== "Anonymous"
          ? userObj.displayName
          : (userObj?.email ?? null)

      if (nameToUse) {
        if (nameToUse.includes(" ")) {
          const parts = nameToUse.split(" ")
          shortName = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
        } else if (nameToUse.includes(".") && nameToUse.includes("@")) {
          const localPart = nameToUse.split("@")[0]
          const parts = localPart.split(".")
          shortName = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
        } else {
          shortName = nameToUse[0].toUpperCase()
        }
      }

      return {
        uuid: s.uuid,
        name: s.name,
        shortName,
      }
    })

    return NextResponse.json(savingsData)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings GET:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
