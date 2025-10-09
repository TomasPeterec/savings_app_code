'use client' // required for React interactivity

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      {/* Header with logo */}
      <Header />

      {/* Intro / slogan */}
      <div className="text-center mt-8 space-y-2 max-w-md">
        <h1 className="text-3xl font-bold text-blue-600">
          Manage your savings easily
        </h1>
        <p className="text-gray-700 text-lg">
          Track your goals as they grow and set priorities as needed
        </p>
      </div>

      {/* Small test link to dashboard */}
      <div className="mt-4">
        <Link
          href="/dashboard"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Go to dashboard
        </Link>
      </div>

      {/* Login section */}
      <div className="mt-8 w-full max-w-md flex flex-col space-y-4">
        {/* Login with Google */}
        <button className="w-full px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600">
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
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign in
          </button>
        </div>

        {/* Registration */}
        <button className="w-full px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600">
          Register
        </button>
      </div>
    </div>
  )
}
