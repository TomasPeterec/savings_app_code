import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

let currencieList: Record<string, number> = {}

export default async function loadCurrencies() {
  const url =
    "https://api.frankfurter.app/latest?base=USD&symbols=AUD,BRL,CAD,CHF,CNY,CZK,DKK,EUR,GBP,HKD,HUF,IDR,ILS,INR,ISK,JPY,KRW,MXN,MYR,NOK,NZD,PHP,PLN,RON,SEK,SGD,THB,TRY,ZAR"

  const response = await fetch(url)
  const data: { rates: Record<string, number> } = await response.json()

  // Mapovanie symbolov na ISO kódy
  const symbolMap: Record<string, string> = {
    "€": "EUR",
    "$": "USD",
  }

  // Prekopíruj iba tie, ktoré sú v rates
  currencieList = Object.fromEntries(Object.entries(data.rates).map(([key, value]) => [key, value]))

  // Pridaj symboly, ak potrebuješ
  for (const [symbol, iso] of Object.entries(symbolMap)) {
    if (currencieList[iso]) {
      currencieList[symbol] = currencieList[iso]
    }
  }
}

const prisma = new PrismaClient()

export async function GET(req: Request) {
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
    select: { uuid: true, monthlyDeposited: true, currency: true },
  })

  let totalUpdated = 0

  // 2. Loop through each saving
  for (const saving of savingsToUpdate) {
    const items = await prisma.items.findMany({
      where: { savingId: saving.uuid },
      select: { itemId: true, saved: true, priority: true },
    })

    // 3. Update each item individually
    for (const item of items) {
      const increment = (saving.monthlyDeposited * Number(item.priority)) / 100

      await prisma.items.update({
        where: { itemId: item.itemId },
        data: { saved: Number(item.saved) + increment },
      })

      totalUpdated++
    }

    const rate = currencieList[saving.currency]
    try {
      await prisma.contributionHistory.create({
        data: {
          savingId: saving.uuid,
          date: new Date(),
          currentValue: saving.monthlyDeposited,
          exchangeRate: rate,
          currency: saving.currency,
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
