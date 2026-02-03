import { NextResponse } from "next/server"
import { adminAuth } from "@/firebase/admin"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { buildAllowedUsers } from "@/components/lib/server/allowedUsers"

const prisma = new PrismaClient()

interface RequestBody {
  savingName: string
  shortDescription: string
  monthlySaved: number
  nextCounting: number
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

    const { savingName, shortDescription, monthlySaved, nextCounting } =
      (await req.json()) as RequestBody

    const newUuid = randomUUID()

    const responseNewSaving = await prisma.savings.create({
      data: {
        userId: firebaseUid,
        uuid: newUuid,
        totalSaved: 0,
        name: savingName,
        monthlyDeposited: monthlySaved,
        description: shortDescription,
        currency: "€",
        countingDate: nextCounting,
      },
    })

    const responseResetSelected = await prisma.savingAccess.updateMany({
      where: { userId: firebaseUid, isSelected: true },
      data: { isSelected: false },
    })

    if (!responseResetSelected) {
      console.error("Failed to reset selected savings for user:", firebaseUid)
    }

    const responseNewSavingAccess = await prisma.savingAccess.create({
      data: {
        savingUuid: newUuid,
        userId: firebaseUid,
        editor: true,
        owner: true,
        isSelected: true,
      },
    })

    const endDate = "3427-09-07"
    const endDateISO = new Date(endDate).toISOString()

    const responseNewItem = await prisma.items.create({
      data: {
        itemId: randomUUID(),
        savingId: newUuid,
        itemName: "Basic Item",
        link: "",
        price: 0,
        saved: 0,
        priority: 0.02,
        locked: false,
        endDate: endDateISO,
      },
    })

    let newItemObject: ChangeItems = {
      savingId: responseNewItem.savingId,
      itemName: responseNewItem.itemName,
      link: responseNewItem.link,
      price: Number(responseNewItem.price),
      endDate: responseNewItem.endDate ? responseNewItem.endDate.toISOString() : null, // <--- string
      saved: Number(responseNewItem.saved),
      priority: Number(responseNewItem.priority),
      itemId: responseNewItem.itemId,
      locked: responseNewItem.locked ?? false,
    }

    const accessList = await prisma.savingAccess.findMany({
      where: { savingUuid: newUuid },
      select: {
        userId: true,
        editor: true,
      },
    })

    const signedAllowedUsers = await buildAllowedUsers(accessList)

    let newSavingObject: ChangeSaving = {
      uuid: newUuid,
      selectedSaving: responseNewSaving.name,
      description: responseNewSaving.description,
      totalSaved: responseNewSaving.totalSaved,
      monthlyDeposited: responseNewSaving.monthlyDeposited,
      countingDate: responseNewSaving.countingDate,
      currency: responseNewSaving.currency,
      signedAllowedUsers: signedAllowedUsers,
    }

    // 6. Map shortName from user info
    return NextResponse.json({
      countOfSavings: await prisma.savings.count({
        where: { userId: firebaseUid },
      }),
      newSaving: newSavingObject,
      editor: responseNewSavingAccess.editor,
      owner: responseNewSavingAccess.owner,
      newItemList: [newItemObject],
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings GET:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
