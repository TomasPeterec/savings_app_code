import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import webpush from "@/lib/server/webPush" // use centralized web-push setup

async function loadCurrencies() {
  const url =
    "https://api.frankfurter.app/latest?base=USD&symbols=AUD,BRL,CAD,CHF,CNY,CZK,DKK,EUR,GBP,HKD,HUF,IDR,ILS,INR,ISK,JPY,KRW,MXN,MYR,NOK,NZD,PHP,PLN,RON,SEK,SGD,THB,TRY,ZAR"

  const response = await fetch(url)
  const data: { rates: Record<string, number> } = await response.json()

  // Mapovanie symbolov na ISO kódy
  const symbolMap: Record<string, string> = {
    "€": "EUR",
    $: "USD",
  }

  // Prekopíruj iba tie, ktoré sú v rates
  const currList = Object.fromEntries(
    Object.entries(data.rates).map(([key, value]) => [key, value])
  )

  // Pridaj symboly, ak potrebuješ
  for (const [symbol, iso] of Object.entries(symbolMap)) {
    if (currList[iso]) {
      currList[symbol] = currList[iso]
    }
  }
  return currList
}

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const currencieList: Record<string, number> = await loadCurrencies()

  const today = new Date()
  const dayOfMonth = today.getDate() // returns a number from 1 to 31

  // protection – Vercel cron only
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  // 1. Find all savings to update today
  const savingsToUpdate = await prisma.savings.findMany({
    where: { countingDate: dayOfMonth },
    select: { uuid: true, monthlyDeposited: true, currency: true, userId: true },
  })

  let totalUpdated = 0

  // 2. Loop through each saving
  for (const saving of savingsToUpdate) {
    const items = await prisma.items.findMany({
      where: { savingId: saving.uuid },
      select: { itemId: true, saved: true, priority: true },
    })

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: saving.userId }, // fetch subscriptions for the user of this saving
      select: { endpoint: true, p256dh: true, auth: true },
    })

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
            body: `The amount of ${saving.monthlyDeposited} ${saving.currency} has been credited to your virtual account.`,
            data: { savingId: saving.uuid },
          })
        )
      } catch (err) {
        console.error("Failed to send push notification:", err)
      }
    }

    // 3. Update each item individually
    for (const item of items) {
      const increment = (saving.monthlyDeposited * Number(item.priority)) / 100

      await prisma.items.update({
        where: { itemId: item.itemId },
        data: { saved: Number(item.saved) + increment },
      })

      totalUpdated++
    }

    const overallSum = items.reduce((sum, item) => sum + Number(item.saved), 0)

    await prisma.savings.update({
      where: { uuid: saving.uuid },
      data: {
        totalSaved: overallSum,
      },
    })

    const rate = currencieList[saving.currency]
    const currencyMap: Record<string, string> = {
      "€": "EUR",
      $: "USD",
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
  }

  return NextResponse.json({
    ok: true,
    updated: totalUpdated,
  })
}
