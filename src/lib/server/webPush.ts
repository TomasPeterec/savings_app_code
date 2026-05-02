// /lib/server/webPush.ts
import webpush from "web-push"

if (!process.env.NEXT_PUBLIC_VAPID_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error("Missing VAPID keys in env")
}

webpush.setVapidDetails(
  "mailto:your@email.com",
  process.env.NEXT_PUBLIC_VAPID_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default webpush
