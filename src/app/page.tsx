'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { auth, googleProvider } from '@/firebase/firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthStore } from '@/store/authStore'
import { useMyStore } from '@/store/myStore'

export default function Home() {
  const router = useRouter() // router for navigation
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const setUser = useAuthStore((state) => state.setUser)
  const setMyNumber = useMyStore((state) => state.setMyNumber)

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      router.push('/dashboard') // redirect after successful Google login
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  // Handle email/password login
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setMyNumber(666)
      setUser(userCredential.user)
      router.push('/dashboard') // redirect after successful email login
    } catch (error) {
      console.error('Login failed', error)
    }
  }

  // Navigate to registration page
  const linkToRegister = async () => router.push('/register')

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <Header />
      
      {/* Main content */}
      <div className="text-center mt-8 space-y-2 max-w-md">
        <h1 className="text-3xl font-bold text-blue-600">
          Manage your savings easily
        </h1>
        <p className="text-gray-700 text-lg">
          Track your goals as they grow and set priorities as needed
        </p>
      </div>

      {/* Test link to dashboard */}
      <div className="mt-4">
        <Link
          href="/dashboard"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Go to dashboard
        </Link>
      </div>

      {/* Login and register section */}
      <div className="mt-8 w-full max-w-md flex flex-col space-y-4">
        {/* Google login */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign in with Google
        </button>

        {/* Email login */}
        <div className="bg-white p-4 rounded shadow space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => login(email, password)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign in
          </button>
        </div>

        {/* Navigate to register page */}
        <button
          onClick={linkToRegister}
          className="w-full px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Register
        </button>
      </div>
    </div>
  )
}
