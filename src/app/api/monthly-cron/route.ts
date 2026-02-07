import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

// utils/exchange.ts
export async function getExchangeRate(
  base: string,
  target: string,
  date?: string
): Promise<number> {
  // base = mena, ktorú máš, target = "USD"
  // date je optional, formát "YYYY-MM-DD" pre historický kurz
  const url = `https://api.exchangerate.host/${date ?? "latest"}?base=${base}&symbols=${target}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch exchange rate: ${res.status}`)
  const data = await res.json()
  return data.rates[target]
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

    const rate = await getExchangeRate(saving.currency, "USD")
    await prisma.contributionHistory.create({
      data: {
        savingId: saving.uuid,
        date: new Date(),
        currentValue: saving.monthlyDeposited,
        exchangeRate: rate,
        currency: saving.currency,
      },
    })
  }

  return NextResponse.json({
    ok: true,
    updated: totalUpdated,
  })
}
