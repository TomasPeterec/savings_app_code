'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { auth } from '@/firebase/firebase'
import { useAuthStore } from '@/store/authStore'
import { useMyStore } from '@/store/myStore'
import { onAuthStateChanged } from 'firebase/auth'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const myNumber = useMyStore((state) => state.myNumber)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Firebase listener sleduje zmeny prihlasenia
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser) // uloží používateľa do Zustand store
        const idToken = await currentUser.getIdToken()
        setToken(idToken)
      } else {
        setUser(null)
        setToken(null)
      }
    })

    return () => unsubscribe() // cleanup listener pri unmount
  }, [setUser])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="flex flex-col items-center justify-center py-20 px-4 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome to your dashboard
        </h1>

        {user && (
          <p className="text-gray-700">
            Hello, <span className="font-semibold">{user.displayName || user.email}</span>!
          </p>
        )}

        {token && (
          <p className="text-gray-500 break-all max-w-md">
            Your current token: {token}
          </p>
        )}

        <p className="text-gray-700 text-center max-w-md">
          Here you will see your savings, goals, and monthly summaries.
        </p>

        {myNumber && (
          <p className="text-gray-500 break-all max-w-md">
            My current number: {myNumber}
          </p>
        )}
      </main>
    </div>
  )
}
