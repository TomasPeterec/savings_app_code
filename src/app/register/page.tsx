'use client' // required for React interactivity

import Header from '@/components/Header'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome to Register page
        </h1>
        <p className="text-gray-700 text-center max-w-md">
          Here you will see form.
        </p>
      </main>
    </div>
  )
}

