"use client"

import { useEffect, useState } from "react"
import Header from "@/components/Header"
import { auth } from "@/firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useAuthStore } from "@/store/authStore"
import "@/styles/theme.css" // import noveho CSS

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setToken(null)
        return
      }

      const idToken = await currentUser.getIdToken()
      setToken(idToken)

      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            email: currentUser.email,
            display_name: currentUser.displayName || "Anonymous", // fallback if null
          }),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error("Backend returned error:", text)
          return
        }

        const data = await res.json()
        console.log("User from backend:", data.user)
      } catch (err) {
        console.error("Backend error:", err)
      }
    })

    return () => unsubscribe()
  }, [user])

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <h1 className="heading">Welcome to your dashboard</h1>

        {user && (
          <p className="paragraph">
            Hello, <span className="highlight">{user.displayName || user.email}</span>!
          </p>
        )}

        <p className="paragraph">
          Here you will see your savings, goals, and monthly summaries.
        </p>

        {token && (
          <p className="paragraph">
            Token: <span className="highlight">{token}</span>
          </p>
        )}
      </main>
    </div>
  )
}
