// src/lib/server/allowedUsers.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface AllowedUser {
  userId: string | null
  shortName: string | null
  editor: boolean
  email: string | null
}

interface AccessItem {
  userId: string | null
  editor?: boolean | null
}

/**
 * Builds signedAllowedUsers from saving access list
 * SERVER ONLY (uses Prisma)
 */
export async function buildAllowedUsers(accessList: AccessItem[]): Promise<AllowedUser[]> {
  return Promise.all(
    accessList.map(async u => {
      if (!u.userId) {
        return {
          userId: null,
          shortName: null,
          editor: u.editor ?? false,
          email: null,
        }
      }

      const userObj = await prisma.user.findUnique({
        where: { firebaseUid: u.userId },
        select: { displayName: true, email: true },
      })

      const nameToUse =
        userObj?.displayName && userObj.displayName !== "Anonymous"
          ? userObj.displayName
          : (userObj?.email ?? null)

      let shortName: string | null = null

      if (nameToUse) {
        if (nameToUse.includes(" ")) {
          const parts = nameToUse.split(" ")
          shortName = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
        } else if (nameToUse.includes(".") && nameToUse.includes("@")) {
          const localPart = nameToUse.split("@")[0]
          const parts = localPart.split(".")
          shortName = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
        } else {
          shortName = nameToUse[0].toUpperCase()
        }
      }

      return {
        userId: u.userId,
        shortName,
        email: userObj?.email ?? null,
        editor: u.editor ?? false,
      }
    })
  )
}
