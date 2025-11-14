import "./globals.css"
import { ReactNode } from "react"
import "@/styles/theme.css"

export const metadata = {
  title: "Savings App",
  description: "Mini application for dedicated saving",
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="sk" className="h-full">
      <body className="app-body">
        <main className="app-main">{children}</main>
        <footer className="app-footer">© 2025 Savings App</footer>
      </body>
    </html>
  )
}
