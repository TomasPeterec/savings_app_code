'use client' // required for React interactivity

export default function Header() {
  return (
    <header className="w-full bg-white shadow py-4 px-6 flex items-center justify-center">
      {/* Logo or app name */}
      <h1 className="text-2xl font-bold text-blue-600">SporenieApp</h1>
    </header>
  )
}
