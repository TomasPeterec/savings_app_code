"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { auth, googleProvider } from "@/firebase/firebase"
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { useAuthStore } from "@/store/authStore"
import { useMyStore } from "@/store/myStore"
import {
  container,
  heroSection,
  heading,
  paragraph,
  link,
  buttonPrimary,
  buttonGoogle,
  buttonRegister,
  inputField,
  formCard,
  loginSection,
} from "@/styles/ui"

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const setUser = useAuthStore((state) => state.setUser)
  const setMyNumber = useMyStore((state) => state.setMyNumber)

  // Google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      router.push("/dashboard")
    } catch (error) {
      console.error("Google sign-in error:", error)
    }
  }

  // Email/password login
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setMyNumber(666)
      setUser(userCredential.user)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  // Navigate to registration
  const linkToRegister = () => router.push("/register")

  return (
    <div className={container}>
      <Header />

      {/* Hero section */}
      <div className={heroSection}>
        <h1 className={heading}>Manage your savings easily</h1>
        <p className={paragraph}>
          Track your goals as they grow and set priorities as needed
        </p>
      </div>

      {/* Login / Register */}
      <div className={loginSection}>
        {/* Google login */}
        <button onClick={handleGoogleSignIn} className={buttonGoogle}>
          Sign in with Google
        </button>

        {/* Email login */}
        <div className={formCard}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputField}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputField}
          />
          <button onClick={() => login(email, password)} className={buttonPrimary}>
            Sign in
          </button>
        </div>

        {/* Register */}
        <button onClick={linkToRegister} className={buttonRegister}>
          Register
        </button>
      </div>
    </div>
  )
}
