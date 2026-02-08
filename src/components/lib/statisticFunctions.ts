import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export function calculateAverage(items: number[]): number {
  if (items.length === 0) return 0
  const sum = items.reduce((acc, val) => acc + val, 0)
  return sum / items.length
}

export function calculateMedian(items: number[]): number {
  if (items.length === 0) return 0
  const sortedItems = [...items].sort((a, b) => a - b)
  const mid = Math.floor(sortedItems.length / 2)

  if (sortedItems.length % 2 === 0) {
    return (sortedItems[mid - 1] + sortedItems[mid]) / 2
  } else {
    return sortedItems[mid]
  }
}

export async function getLastXMontshlyValues(savingId: string, count: number) {
  const contributionList = await prisma.contributionHistory.findMany({
    where: { savingId },
  })

  const sortedList = contributionList
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-count)

  return sortedList
}
