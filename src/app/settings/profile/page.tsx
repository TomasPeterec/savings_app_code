"use client" // required for React interactivity

import Header from "@/components/Header"

import "@/styles/theme.css" // import new CSS

export default function RegistrationPage() {
  return (
    <div className="base-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">Welcome to the Profile Page</h1>
      </div>

      <div className="actions-section">
        <div className="form-card"></div>
      </div>
    </div>
  )
}
