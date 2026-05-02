"use client"

import { useEffect } from "react"
import { auth } from "@/firebase/firebase"
import type { User } from "firebase/auth" // typ Firebase user
import { onAuthStateChanged } from "firebase/auth"

export default function NotificationCheck() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (!currentUser) return

      try {
        const idToken = await currentUser.getIdToken()

        // Check if browser supports notifications & service worker
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
          console.log("Push notifications are not supported")
          return
        }

        // Ask user for permission
        const permission = await Notification.requestPermission()
        if (permission !== "granted") {
          console.log("User denied notifications")
          return
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker registered:", registration)

        // Check for existing subscription
        let subscription = await registration.pushManager.getSubscription()
        if (!subscription) {
          // Subscribe if none exists
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY!),
          })
        } else {
          console.log("Existing subscription found:", subscription.endpoint)
        }

        // Send subscription to backend
        const res = await fetch("/api/save-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(subscription),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error("Failed to save subscription:", text)
        } else {
          console.log("User subscribed for push notifications")
        }
      } catch (err) {
        console.error("Error in notification subscription:", err)
      }
    })

    return () => unsubscribe() // cleanup listener on unmount
  }, [])

  return null
}

// Helper function to convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)))
}
