import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import webpush from "@/lib/server/webPush"
import { loadCurrencies } from "@/lib/server/loadCurrencies"
import { updateSavingItems } from "@/lib/server/updateSavings"

const prisma = new PrismaClient()

// Type for savings to update
type SavingForUpdate = {
  uuid: string
  monthlyDeposited: number
  currency: string
  undistributed: number
}

// Type for items to update
type ItemForUpdate = {
  itemId: string
  saved: number
  priority: number
  price: number
  itemName: string
}

export async function GET(req: Request) {
  const currencieList: Record<string, number> = await loadCurrencies()

  const today = new Date()
  const dayOfMonth = today.getDate() // returns 1–31

  // Cron authorization check (Vercel only)
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  // 1. Get all savings that need to be updated today
  const savingsToUpdate: SavingForUpdate[] = await prisma.savings.findMany({
    where: { countingDate: dayOfMonth },
    select: {
      uuid: true,
      monthlyDeposited: true,
      currency: true,
      undistributed: true,
    },
  })

  let totalUpdated = 0

  // 2. Loop through each saving
  for (const saving of savingsToUpdate) {
    // fetch items for this saving and convert Decimal → number
    const items: ItemForUpdate[] = (
      await prisma.items.findMany({
        where: { savingId: saving.uuid },
        select: { itemId: true, saved: true, priority: true, price: true, itemName: true },
      })
    ).map(item => ({
      itemId: item.itemId,
      saved: Number(item.saved),
      priority: Number(item.priority),
      price: Number(item.price),
      itemName: item.itemName ?? "",
    }))

    // fetch subscriptions for the use

    const sharingUsers = await prisma.savingAccess.findMany({
      where: { savingUuid: saving.uuid },
      select: { userId: true },
    })

    const allSharingUserIds = [...new Set(sharingUsers.map(su => su.userId))]

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: { in: allSharingUserIds } },
      select: { endpoint: true, p256dh: true, auth: true },
    })

    // send push notifications
    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify({
            title: "Credited virtual amount",
            body: `${saving.monthlyDeposited} ${saving.currency} has been virtually distributed to your savings items.`,
            data: { savingId: saving.uuid },
          })
        )
      } catch (err) {
        console.error("Failed to send push notification:", err)
      }
    }

    // 3. Update items, savings, and contributionHistory
    totalUpdated += await updateSavingItems(saving, items, currencieList)
  }

  return NextResponse.json({
    ok: true,
    updated: totalUpdated,
  })
}
