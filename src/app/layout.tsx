import "./globals.css"
import { ReactNode } from "react"
import { body, main, footer } from "@/styles/ui"

export const metadata = {
  title: "Savings App",
  description: "Mini application for dedicated saving",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk">
      <body className={body}>
        <main className={main}>{children}</main>
        <footer className={footer}>© 2025 Savings App</footer>
      </body>
    </html>
  )
}
