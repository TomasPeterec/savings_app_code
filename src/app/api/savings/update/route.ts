import { NextResponse } from "next/server"
import { adminAuth } from "@/firebase/admin"
import { PrismaClient, Prisma } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

interface NwItemInterface {
  itemId?: string
  itemName: string | null
  link: string | null
  price: number | null
  endDate: string | null
  saved: number | null
  priority: number | null
  locked: boolean | null
}

interface RequestBody {
  actionType: string
  newItem: NwItemInterface
  items: NwItemInterface[]
  savingUuId: string | null
}

interface ItemData {
  itemId: string
  itemName: string | null
  link: string | null
  price: number | null
  endDate: string | null
  saved: number | null
  priority: number | null
  locked: boolean | null
}

function normalizeDate(input: string | { $type: string; value: string } | null): Date {
  let date: Date

  if (!input) {
    date = new Date()
  } else if (typeof input === "string") {
    date = new Date(input)
  } else if (typeof input === "object" && input.$type === "DateTime" && input.value) {
    date = new Date(input.value)
  } else {
    date = new Date()
  }

  // Obmedzenie na bezpečný rozsah pre Prisma (±8.64e15 ms)
  const MAX_DATE = new Date(8.64e15)
  const MIN_DATE = new Date(-8.64e15)
  if (date > MAX_DATE) return MAX_DATE
  if (date < MIN_DATE) return MIN_DATE

  return date
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
    if (!firebaseUid) {
      console.log("no valid user token")
    }

    // 4. Parse body
    const { newItem, items, savingUuId, actionType } = (await req.json()) as RequestBody

    console.log("Action Type:", actionType)

    if (!savingUuId) {
      return NextResponse.json({ error: "savingUuId is missing" }, { status: 400 })
    }

    if (actionType === "add") {
      // 5. Create new item
      const fromNewItem = await prisma.items.create({
        data: {
          savingId: savingUuId,
          itemId: newItem.itemId || uuidv4(),
          itemName: newItem.itemName ?? undefined,
          link: newItem.link ?? undefined,
          price: new Prisma.Decimal(newItem.price ?? 0),
          saved: new Prisma.Decimal(newItem.saved ?? 0),
          priority: new Prisma.Decimal(newItem.priority ?? 0),
          locked: newItem.locked,
          endDate: newItem.endDate ? new Date(newItem.endDate) : new Date(),
        },
      })

      if (!fromNewItem) {
        console.log("bad response from DB", fromNewItem)
      }
    }

    if (actionType === "edit") {
      // 5. Create new item
      const fromNewItem = await prisma.items.update({
        where: {
          itemId: newItem.itemId,
        },
        data: {
          savingId: savingUuId,
          itemId: newItem.itemId,
          itemName: newItem.itemName ?? undefined,
          link: newItem.link ?? undefined,
          price: new Prisma.Decimal(newItem.price ?? 0),
          saved: new Prisma.Decimal(newItem.saved ?? 0),
          priority: new Prisma.Decimal(newItem.priority ?? 0),
          locked: newItem.locked,
          endDate: newItem.endDate ? new Date(newItem.endDate) : new Date(),
        },
      })

      if (!fromNewItem) {
        console.log("bad response from DB", fromNewItem)
      }
    }

    if (actionType === "delete") {
      // Delete item
      const fromNewItem = await prisma.items.delete({
        where: {
          itemId: newItem.itemId,
        },
      })

      if (!fromNewItem) {
        console.log("bad response from DB", fromNewItem)
      }
    }

    // 6. Update existing items
    await Promise.all(
      items.map(async item => {
        if (!item.itemId || item.locked) return
        await prisma.items.update({
          where: { itemId: item.itemId },
          data: {
            priority: new Prisma.Decimal(item.priority ?? 0),
            endDate: normalizeDate(item.endDate),
          },
        })
      })
    )

    // 7. Fetch all items for the saving
    const rawItems = await prisma.items.findMany({
      where: { savingId: savingUuId },
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

    // 8. Convert to frontend-friendly types
    const itemsData: ItemData[] = rawItems.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName,
      link: item.link,
      price: item.price !== null ? Number(item.price) : null,
      saved: item.saved !== null ? Number(item.saved) : null,
      endDate: item.endDate ? item.endDate.toISOString() : null,
      priority: item.priority !== null ? Number(item.priority) : null,
      locked: item.locked ?? null,
    }))

    // 9. Return JSON response
    return NextResponse.json({
      itemsData,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/savings:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
