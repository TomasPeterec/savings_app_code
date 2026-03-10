import { PrismaClient } from "@prisma/client"
import webpush from "@/lib/server/webPush"

const prisma = new PrismaClient()

export async function updateSavingItems(
  saving: {
    uuid: string
    monthlyDeposited: number
    currency: string
    userId: string //string according to Prisma model
    undistributed: number
  },
  items: { itemId: string; saved: number; priority: number; price: number; itemName: string }[],
  currencieList: Record<string, number>
) {
  let totalUpdated = 0
  let totalOverflowToDB = 0
  const monthlyAndUndistributed = saving.monthlyDeposited + saving.undistributed

  // 1. Update each item individually
  for (const item of items) {
    item.saved += (monthlyAndUndistributed * item.priority) / 100
  }

  let overflowsExist = true

  while (overflowsExist) {
    overflowsExist = false
    let totalOverflow = 0

    // 1. Filter items that are not yet full
    const underfilledItems = items.filter(i => i.saved < i.price)

    // 2. Collect overflow from all items that exceeded their price
    for (const item of items) {
      if (item.saved > item.price) {
        const overflow = item.saved - item.price
        item.saved = item.price
        totalOverflow += overflow
        overflowsExist = true
      }
    }

    if (underfilledItems.length === 0) {
      totalOverflowToDB = totalOverflow
    }

    if (underfilledItems.length > 0 && totalOverflow > 0) {
      // 3. Sum priorities of remaining underfilled items
      const totalPriority = underfilledItems.reduce((sum, i) => sum + i.priority, 0)

      // 4. Redistribute overflow according to relative priority
      for (const item of underfilledItems) {
        const share = (item.priority / totalPriority) * totalOverflow
        item.saved += share
      }
    } else {
      break
    }
  }

  // only for returning the number of updated items, we can do this in a single loop after all calculations are done
  for (const item of items) {
    await prisma.items.update({
      where: { itemId: item.itemId },
      data: { saved: item.saved },
    })
    totalUpdated++
  }

  // 2. Recalculate the total saved for the saving
  const overallSum = items.reduce((sum, item) => sum + item.saved, 0)

  await prisma.savings.update({
    where: { uuid: saving.uuid },
    data: { totalSaved: overallSum, undistributed: totalOverflowToDB },
  })

  // 3. Create a contributionHistory record
  const rate = currencieList[saving.currency]
  const currencyMap: Record<string, string> = {
    "€": "EUR",
    $: "USD",
  }

  const fullfiledItems = items.filter(i => i.saved === i.price)

  const selectedItemsNames = fullfiledItems.map(item => item.itemName).join(", ")

  if (fullfiledItems.length > 0) {
    try {
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId: saving.userId },
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
              title: "Credited amount",
              body: `On ${fullfiledItems.length < 2 ? "item" : "items"} ${selectedItemsNames} has been achieved the price.`,
              data: { savingId: saving.uuid },
            })
          )
        } catch (err) {
          console.error("Failed to send push notification:", err)
        }
      }
    } catch (e) {
      console.error("Failed to fetch subscriptions:", e)
    }
  }

  try {
    await prisma.contributionHistory.create({
      data: {
        savingId: saving.uuid,
        date: new Date(),
        currentValue: saving.monthlyDeposited,
        exchangeRate: rate,
        currency: currencyMap[saving.currency] ?? saving.currency,
      },
    })
  } catch (e) {
    console.error("ContributionHistory insert failed:", e)
  }

  return totalUpdated
}
