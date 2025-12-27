import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

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
    select: { uuid: true, monthlyDeposited: true }
  })

  let totalUpdated = 0

  // 2. Loop through each saving
  for (const saving of savingsToUpdate) {
    const items = await prisma.items.findMany({
      where: { savingId: saving.uuid },
      select: { itemId: true, saved: true, priority: true }
    })

    // 3. Update each item individually
    for (const item of items) {
      const increment = (saving.monthlyDeposited * Number(item.priority)) / 100

      await prisma.items.update({
        where: { itemId: item.itemId },
        data: { saved: Number(item.saved) + increment }
      })

      totalUpdated++
    }
  }

  return NextResponse.json({
    ok: true,
    updated: totalUpdated
  })
}
