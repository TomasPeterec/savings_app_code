import { NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  // 🔐 ochrana – iba Vercel cron
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  console.log("CRON RUNNING")

  const result = await prisma.items.updateMany({
    where: {
      savingId: "9f4b7d13-0c89-4c3d-bc73-9b0f7b7fa3b7"
    },
    data: {
      saved: {
        increment: new Prisma.Decimal(10)
      }
    }
  })

  console.log("UPDATED ROWS:", result.count)

  return NextResponse.json({
    ok: true,
    updated: result.count
  })
}
