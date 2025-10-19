'use client' // required for React interactivity

import { header, headerTitle } from "@/styles/ui"

export default function Header() {
  return (
    <header className={header}>
      {/* Logo or app name */}
      <h1 className={headerTitle}>SporenieApp</h1>
    </header>
  )
}
