// app/api/faq/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

// Avoid multiple Prisma instances in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient }
export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["query", "error", "warn"] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const faqData = await prisma.faq.findMany({
      select: { id: true, question: true, answer: true },
      orderBy: { id: "asc" }, // optional: always return in order
    })

    if (!faqData || faqData.length === 0) {
      console.warn("FAQ table is empty")
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(faqData, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in /api/faq GET:", message)
    return NextResponse.json(
      { error: "Failed to fetch FAQ from database", detail: message },
      { status: 500 }
    )
  }
}
