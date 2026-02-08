import { NextResponse } from "next/server"
import { adminAuth } from "@/firebase/admin"
import { PrismaClient } from "@prisma/client"
import {
  calculateAverage,
  calculateMedian,
  getLastXMontshlyValues,
} from "@/components/lib/statisticFunctions"

const prisma = new PrismaClient()

// ✅ Add optional endDateSource
interface SendSavingDTO {
  uuid: string
  name: string
  description: string
  monthlyDeposited: number
  nextCounting: number
  currency: string | null
  totalSaved: number
  endDateSource?: string | null
}

interface AllowedUserDTO {
  id: string | null
  email: string | null
  editor: boolean
  forDeleting: boolean
}

interface RequestBody {
  sendSaving: SendSavingDTO
  cuttedList: AllowedUserDTO[]
}

export async function POST(req: Request) {
  try {
    // 1 Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 })

    // 2 Extract Bearer token
    const token = authHeader.split(" ")[1]
    if (!token) return NextResponse.json({ error: "Invalid token format" }, { status: 401 })

    // 3 Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token)
    const firebaseUid = decodedToken.uid
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 4 Parse request body
    const { sendSaving, cuttedList } = (await req.json()) as RequestBody
    if (!sendSaving.uuid)
      return NextResponse.json({ error: "Saving UUID is missing" }, { status: 400 })

    // 5 Update the saving itself
    const updatedSaving = await prisma.savings.update({
      where: { uuid: sendSaving.uuid },
      data: {
        name: sendSaving.name,
        description: sendSaving.description,
        monthlyDeposited: sendSaving.monthlyDeposited,
        totalSaved: sendSaving.totalSaved,
        countingDate: sendSaving.nextCounting,
        currency: sendSaving.currency ?? "€",
        endDateSource: sendSaving.endDateSource ?? "Current monthly saved value",
      },
      select: {
        uuid: true,
        name: true,
        description: true,
        monthlyDeposited: true,
        totalSaved: true,
        countingDate: true,
        currency: true,
      },
    })

    // 6 Handle savingAccess rows (delete / update / create)
    await Promise.all(
      cuttedList.map(async user => {
        if (!user.id) return

        if (user.forDeleting) {
          await prisma.savingAccess.deleteMany({
            where: { savingUuid: sendSaving.uuid, userId: user.id },
          })
          return
        }

        const existing = await prisma.savingAccess.findFirst({
          where: { savingUuid: sendSaving.uuid, userId: user.id },
        })

        if (existing) {
          await prisma.savingAccess.update({
            where: { id: existing.id },
            data: { editor: user.editor, isSelected: true },
          })
        } else {
          await prisma.savingAccess.create({
            data: {
              savingUuid: sendSaving.uuid,
              userId: user.id,
              editor: user.editor,
              isSelected: false,
            },
          })
        }
      })
    )

    // 7 Fetch all access rows for this saving, including user emails
    const accessRows = await prisma.savingAccess.findMany({
      where: { savingUuid: sendSaving.uuid },
      include: { user: true },
    })

    // 8 Map to expected format (shortName logic)
    const allowedUsers = accessRows.map(row => {
      let shortName: string | null = null
      const nameToUse =
        row.user?.displayName && row.user.displayName !== "Anonymous"
          ? row.user.displayName
          : (row.user?.email ?? null)

      if (nameToUse) {
        if (nameToUse.includes(" ")) {
          const parts = nameToUse.split(" ")
          shortName = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
        } else if (nameToUse.includes(".") && nameToUse.includes("@")) {
          const parts = nameToUse.split("@")[0].split(".")
          shortName = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
        } else {
          shortName = nameToUse[0].toUpperCase()
        }
      }

      return {
        shortName,
        userId: row.userId,
        email: row.user?.email ?? null,
        editor: row.editor ?? false,
        forDeleting: !row.isSelected,
      }
    })

    // 9 Compute average & median with fallback
    const monthlyValues = (await getLastXMontshlyValues(updatedSaving.uuid, 12)).map(i =>
      Number(i.currentValue)
    )
    const average = monthlyValues.length
      ? calculateAverage(monthlyValues)
      : updatedSaving.monthlyDeposited
    const median = monthlyValues.length
      ? calculateMedian(monthlyValues)
      : updatedSaving.monthlyDeposited

    const updatedSavingPlus = {
      ...updatedSaving,
      average,
      median,
    }

    // 10 Return updated saving + allowed users
    return NextResponse.json({ updatedSaving: updatedSavingPlus, allowedUsers })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings/settings:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
