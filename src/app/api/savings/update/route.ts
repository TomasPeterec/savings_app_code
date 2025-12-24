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
    if(!firebaseUid){
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
          endDate: newItem.endDate
            ? new Date(newItem.endDate)
            : new Date(),
        },
      })  

       if(!fromNewItem) {
        console.log("bad response from DB", fromNewItem)
      }
    }

       if (actionType === "edit") {
         // 5. Create new item
      const fromNewItem = await prisma.items.update({
        where: {
          itemId: newItem.itemId
        },
        data: {
          savingId: savingUuId,
          itemId: newItem.itemId,
          itemName: newItem.itemName ?? undefined,
          link: newItem.link ?? undefined,
          price: new Prisma.Decimal(newItem.price ?? 0),
          saved: new Prisma.Decimal(newItem.saved ?? 0),
          priority: new Prisma.Decimal(newItem.priority ?? 0),
          endDate: newItem.endDate
            ? new Date(newItem.endDate)
            : new Date(),
        },
      })  

       if(!fromNewItem) {
        console.log("bad response from DB", fromNewItem)
      }
    }

    if (actionType === "delete") {
      // Delete item
      const fromNewItem = await prisma.items.delete({
        where: {
          itemId: newItem.itemId
        },
      })

       if(!fromNewItem) {
        console.log("bad response from DB", fromNewItem)
      }
    }
   

    // 6. Update existing items
    await Promise.all(
      items.map(async (item) => {
        if (!item.itemId) return // skip items without itemId
        await prisma.items.update({
          where: { itemId: item.itemId },
          data: {
            priority: new Prisma.Decimal(item.priority ?? 0),
            endDate: item.endDate ? new Date(item.endDate) : new Date(),
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
      },
    })

    // 8. Convert to frontend-friendly types
    const itemsData: ItemData[] = rawItems.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      link: item.link,
      price: item.price !== null ? Number(item.price) : null,
      saved: item.saved !== null ? Number(item.saved) : null,
      endDate: item.endDate ? item.endDate.toISOString() : null,
      priority: item.priority !== null ? Number(item.priority) : null,
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
