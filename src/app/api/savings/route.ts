import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { adminAuth } from "@/firebase/admin"

const prisma = new PrismaClient()

interface RequestBody {
  email: string
  displayName?: string | null
}

interface AllowedUser {
  userId: string | null
  editor: boolean
}

interface ItemData {
  itemId: string
  itemName: string | null
  link: string | null
  price: number | null
  endDate: string | null
  saved: number | null
  priority: number | null
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
    const firebaseUid = decodedToken.uid

    // 4. Parse body
    const { email, displayName } = (await req.json()) as RequestBody

    // 5. Upsert user
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { email, displayName: displayName },
      create: { firebaseUid, email, displayName: displayName },
    })

    // 6. Get selected saving for this user
    const selectedSavingAccess = await prisma.savingAccess.findFirst({
      where: { userId: firebaseUid, isSelected: true },
      select: {
        savingUuid: true,
        editor: true,
        owner: true,
      },
    })

    let uuid: string | null = null
    let nameOfSaving: string | null = null
    let savingDescription: string | null = null
    let savingMonthlyDeposited: number | null = null
    let savingTotalSaved: number | null = null
    let savingCurrency: string | null = null
    let countingDate: number | null = null
    let allowedUsers: AllowedUser[] = []
    let itemsData: ItemData[] = []
    let userOfSelectedSaving: string | null = null
    let editor: boolean = false
    let owner: boolean = false

    if (selectedSavingAccess) {
      // 6a. Fetch saving details
      const saving = await prisma.savings.findUnique({
        where: { uuid: selectedSavingAccess.savingUuid },
        select: {
          name: true,
          description: true,
          monthlyDeposited: true,
          totalSaved: true,
          currency: true,
          countingDate: true,
          userId: true,
        },
      })

      if (saving) {
        uuid = selectedSavingAccess.savingUuid
        nameOfSaving = saving.name
        savingDescription = saving.description
        savingMonthlyDeposited = saving.monthlyDeposited
        savingTotalSaved = saving.totalSaved
        savingCurrency = saving.currency
        countingDate = saving.countingDate
        userOfSelectedSaving = saving.userId
      }

      editor = selectedSavingAccess.editor ?? false
      owner = selectedSavingAccess.owner ?? false

      // 6b. Fetch items for this saving
      const rawItems = await prisma.items.findMany({
        where: { savingId: selectedSavingAccess.savingUuid },
        select: {
          itemId: true,
          itemName: true,
          link: true,
          price: true,
          endDate: true,
          saved: true,
          priority: true,
          locked: true,
        },
      })

      // Convert Decimal/Date to JSON-friendly types
      itemsData = rawItems.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        link: item.link,
        price: item.price !== null ? Number(item.price) : null,
        saved: item.saved !== null ? Number(item.saved) : null,
        endDate: item.endDate ? item.endDate.toISOString() : null,
        priority: item.priority !== null ? Number(item.priority) : null,
        locked: item.locked,
      }))

      // 6c. Fetch allowed users
      const accessList = await prisma.savingAccess.findMany({
        where: { savingUuid: selectedSavingAccess.savingUuid },
        select: {
          editor: true,
          userId: true,
        },
      })

      allowedUsers = await Promise.all(
        accessList.map(async u => {
          if (!u.userId) return { userId: null, editor: u.editor ?? false }

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
            shortName: shortName,
            email: userObj?.email ?? null,
            editor: u.editor ?? false,
          }
        })
      )
    }

    // 7. Return JSON response
    return NextResponse.json({
      countOfSavings: await prisma.savings.count({
        where: { userId: firebaseUid },
      }),
      uuid: uuid,
      user,
      editor: editor,
      owner: owner,
      userOfSelectedSaving: userOfSelectedSaving,
      selectedSavingName: nameOfSaving,
      description: savingDescription,
      monthlyDeposited: savingMonthlyDeposited,
      totalSaved: savingTotalSaved,
      currency: savingCurrency,
      countingDate: countingDate,
      allowedUsers,
      itemsData,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
