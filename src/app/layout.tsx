import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Savings App',
  description: 'Mini application for dedicated saving',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk">
      <body className="bg-gray-100 font-sans min-h-screen">

        <main className="p-4">{children}</main>

        <footer className="text-center text-gray-500 text-sm p-4 mt-auto">
          © 2025 Savings App
        </footer>
      </body>
    </html>
  )
}
