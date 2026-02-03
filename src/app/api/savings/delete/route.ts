import { NextResponse } from "next/server"
import { adminAuth } from "@/firebase/admin"
import { PrismaClient } from "@prisma/client"
import { buildAllowedUsers } from "@/components/lib/server/allowedUsers"

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

export async function DELETE(req: Request) {
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

    let chosenUuid = ""

    ////////////////////////////////////
    /// Start of deleting old saving ///
    ////////////////////////////////////

    // Delete saving access and saving
    const responseDeletedAccess = await prisma.savingAccess.deleteMany({
      where: {
        savingUuid: uuid,
      },
    })

    if (!responseDeletedAccess) {
      console.error("Failed to delete saving access for user:", firebaseUid)
    }

    const responseDeletedSaving = await prisma.savings.deleteMany({
      where: {
        uuid: uuid,
      },
    })

    if (!responseDeletedSaving) {
      console.error("Failed to delete saving for user:", firebaseUid)
    }

    const setSelectionToAnother = await prisma.savingAccess.findFirst({
      where: { userId: firebaseUid },
      select: { savingUuid: true },
    })

    // Reset selected saving for user
    if (setSelectionToAnother && setSelectionToAnother.savingUuid) {
      chosenUuid = setSelectionToAnother.savingUuid

      await prisma.savingAccess.updateMany({
        where: { userId: firebaseUid, isSelected: true },
        data: { isSelected: false },
      })

      const responseResetSelected = await prisma.savingAccess.updateMany({
        where: {
          userId: firebaseUid,
          savingUuid: setSelectionToAnother.savingUuid,
        },
        data: {
          isSelected: true,
        },
      })

      if (!responseResetSelected) {
        console.error("Failed to reset selected savings for user:", firebaseUid)
      }
    }

    //////////////////////////////////
    /// End of deleting old saving ///
    //////////////////////////////////

    const chosenSaving = await prisma.savings.findFirst({
      where: { uuid: chosenUuid },
    })

    const newSavingObj: ChangeSaving = {
      uuid: chosenSaving?.uuid || "",
      selectedSaving: chosenSaving?.name || "",
      description: chosenSaving?.description || "",
      totalSaved: chosenSaving?.totalSaved || 0,
      monthlyDeposited: chosenSaving?.monthlyDeposited || 0,
      countingDate: chosenSaving?.countingDate || null,
      currency: chosenSaving?.currency || "€",
      signedAllowedUsers: [],
    }

    const itemList = await prisma.items.findMany({
      where: { savingId: chosenSaving?.uuid || "" },
    })

    const chosenItemList: ChangeItems[] = itemList.map(item => ({
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

    const editorOwnerAccess = await prisma.savingAccess.findFirst({
      where: { savingUuid: chosenUuid, userId: firebaseUid },
      select: { editor: true },
    })

    const editor = editorOwnerAccess?.editor || false
    const owner = editorOwnerAccess?.editor || false

    ///////////////////////////////
    /// Completing for frontend ///
    ///////////////////////////////

    const accessList = await prisma.savingAccess.findMany({
      where: { savingUuid: chosenUuid },
      select: {
        userId: true,
        editor: true,
      },
    })

    const signedAllowedUsers = await buildAllowedUsers(accessList)

    // Map shortName from user info
    return NextResponse.json({
      countOfSavings: await prisma.savings.count({
        where: { userId: firebaseUid },
      }),
      chosenSaving: newSavingObj,
      editor: editor,
      owner: owner,
      chosenItemList: chosenItemList,
      signedAllowedUsers: signedAllowedUsers,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings GET:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
