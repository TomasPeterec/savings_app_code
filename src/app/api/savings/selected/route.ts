import { NextResponse } from "next/server"
import { adminAuth } from "@/firebase/admin"
import { PrismaClient } from "@prisma/client"
import {
  calculateAverage,
  calculateMedian,
  getLastXMontshlyValues,
} from "@/components/lib/statisticFunctions"

const prisma = new PrismaClient()

interface RequestBody {
  uuid: string
}

interface AllowedUser {
  shortName: string | null
  userId: string | null
  editor: boolean
  email: string | null
}

interface ChangeSaving {
  uuid: string
  selectedSaving: string
  description: string
  totalSaved: number
  monthlyDeposited: number
  countingDate: number | null
  currency: string
  signedAllowedUsers: AllowedUser[]
  average: number
  median: number
}

interface ChangeItems {
  savingId: string
  itemName: string | null
  link: string | null
  price: number
  endDate: string | null
  saved: number
  priority: number
  itemId: string
  locked: boolean
}

export async function POST(req: Request) {
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

    const { uuid } = (await req.json()) as RequestBody

    console.log("Uuid from frontend: ", uuid)

    // 4. Get all saving UUIDs this user has access to
    const currentSaving = await prisma.savings.findFirst({
      where: { uuid: uuid },
      select: {
        uuid: true,
        name: true,
        userId: true,
        description: true,
        monthlyDeposited: true,
        totalSaved: true,
        currency: true,
        countingDate: true,
      },
    })

    if (!currentSaving) {
      return NextResponse.json({ error: "Saving access not found" }, { status: 404 })
    }

    const accessList = await prisma.savingAccess.findMany({
      where: { savingUuid: currentSaving.uuid },
      select: {
        userId: true,
        editor: true,
      },
    })

    const signedAllowedUsers: AllowedUser[] = await Promise.all(
      accessList.map(async u => {
        if (!u.userId)
          return { userId: null, shortName: null, editor: u.editor ?? false, email: null }

        const userObj = await prisma.user.findUnique({
          where: { firebaseUid: u.userId },
          select: { displayName: true, email: true },
        })

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
          userId: u.userId,
          shortName,
          email: userObj?.email ?? null,
          editor: u.editor ?? false,
        }
      })
    )

    const sortedSavingMonthly = await getLastXMontshlyValues(uuid || "", 12)
    const average = calculateAverage(sortedSavingMonthly.map(i => Number(i.currentValue))) || 0
    const median = calculateMedian(sortedSavingMonthly.map(i => Number(i.currentValue))) || 0

    const changeSaving: ChangeSaving = {
      uuid: currentSaving.uuid,
      selectedSaving: currentSaving.name, // replace with actual name if backend provides
      description: currentSaving.description,
      totalSaved: currentSaving.totalSaved,
      monthlyDeposited: currentSaving.monthlyDeposited, // or backend value
      countingDate: currentSaving.countingDate,
      currency: currentSaving.currency,
      signedAllowedUsers: signedAllowedUsers,
      average: average ? average : currentSaving.monthlyDeposited,
      median: median ? median : currentSaving.monthlyDeposited,
    }

    const currentItems = await prisma.items.findMany({
      where: { savingId: uuid },
      select: {
        savingId: true,
        itemName: true,
        link: true,
        price: true,
        endDate: true,
        saved: true,
        priority: true,
        itemId: true,
        locked: true,
      },
    })

    const changeItems: ChangeItems[] = currentItems.map(item => ({
      savingId: item.savingId,
      itemName: item.itemName,
      link: item.link,
      price: Number(item.price),
      endDate: item.endDate ? item.endDate.toISOString() : null, // <--- string
      saved: Number(item.saved),
      priority: Number(item.priority),
      itemId: item.itemId,
      locked: item.locked ?? false,
    }))

    // --- Reset all savings for this user to false ---
    await prisma.savingAccess.updateMany({
      where: { userId: firebaseUid },
      data: { isSelected: false },
    })

    // --- Set the selected saving for this user to true ---
    await prisma.savingAccess.updateMany({
      where: {
        userId: firebaseUid,
        savingUuid: currentSaving.uuid,
      },
      data: { isSelected: true },
    })

    const selectedSavingAccess = await prisma.savingAccess.findFirst({
      where: { userId: firebaseUid, isSelected: true },
      select: {
        savingUuid: true,
        editor: true,
        owner: true,
      },
    })

    let editor: boolean = false
    let owner: boolean = false

    if (selectedSavingAccess) {
      editor = selectedSavingAccess.editor ?? false
      owner = selectedSavingAccess.owner ?? false
    }

    // 6. Map shortName from user info
    return NextResponse.json({
      changeSaving,
      changeItems,
      countOfSavings: await prisma.savings.count({
        where: { userId: firebaseUid },
      }),
      editor: editor,
      owner: owner,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings GET:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
