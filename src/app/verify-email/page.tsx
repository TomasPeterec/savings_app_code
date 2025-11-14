'use client' // required for React interactivity

import Header from '@/components/Header'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/navigation"
import '@/styles/theme.css' // import new CSS

export default function RegistrationPage() {
  const router = useRouter()


  return (
    <div className="base-container">
      <Header />

     <div className="hero-section">
      <h1 className="heading">Please, check your email</h1>
      <p className="perex">
        A confirmation link has been sent to your email. 
        Please click on it to verify your account.
      </p>
    </div>
      <div className="actions-section">
        <button
          onClick={() =>  router.push("/")}
          className="button-secondary"
        >
          Return to login page
        </button>
      </div>
    </div>
  )
}
