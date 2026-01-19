"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { auth, googleProvider } from "@/firebase/firebase"
import { signInWithPopup, signInWithEmailAndPassword, AuthError } from "firebase/auth"
import { useAuthStore } from "@/store/authStore"
import { myEmailValidation } from "@/components/lib/emailValidation"
// import '@/styles/theme.css'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loginError, setLoginError] = useState("")

  const setUser = useAuthStore(state => state.setUser)

  // Google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      router.push("/dashboard")
    } catch (error: unknown) {
      console.error("Google sign-in error:", error)
      setLoginError("Error signing in with Google.")
    }
  }

  // Email validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(myEmailValidation(value))
  }

  // Email/password login
  const login = async (email: string, password: string) => {
    setLoginError("")
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      router.push("/dashboard")
    } catch (error: unknown) {
      const e = error as AuthError
      console.error("Login failed:", e.code)
      switch (e.code) {
        case "auth/invalid-email":
          setLoginError("Invalid email.")
          break
        case "auth/user-disabled":
          setLoginError("Account is disabled.")
          break
        case "auth/user-not-found":
          setLoginError("Account does not exist.")
          break
        case "auth/wrong-password":
          setLoginError("Incorrect password.")
          break
        case "auth/too-many-requests":
          setLoginError("Too many attempts.")
          break
        default:
          setLoginError("Error signing in.")
          break
      }
    }
  }

  const linkToRegister = () => router.push("/register")

  return (
    <div className="base-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">Manage your savings easily</h1>
        <p className="perex">Track your goals as they grow and set priorities as needed</p>
      </div>

      {/* Action / Form section */}
      <div className="actions-section">
        {/* Google Sign In */}
        <div className="google-box">
          <button onClick={handleGoogleSignIn} className="button-secondary">
            <img className="google-logo" src="/images/google-logo.svg" alt="Google logo" />
            Sign in with Google
            <div className="google-logo">
              <span>&nbsp;</span>
            </div>
          </button>
        </div>

        {/* Email/Password Sign In */}
        <div className="form-card">
          <label>
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label">Email</p>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={`input-field ${emailError ? "error" : ""}`}
            />
            <div className="form-half-separator-down">
              {emailError && <p className="field-message">{emailError}</p>}
            </div>
          </label>

          <label>
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label">Password</p>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
            />
            <div className="form-half-separator-down">
              {loginError && <p className="field-message">{loginError}</p>}
            </div>
          </label>

          <div className="form-half-separator-up vertical-align-bottom">
            <br />
          </div>

          <button onClick={() => login(email, password)} className="button-primary">
            Sign in
          </button>

          <div className="form-half-separator-down">
            <br />
          </div>
        </div>

        {/* Register redirect */}
        <button onClick={linkToRegister} className="button-secondary">
          Register
        </button>
      </div>
    </div>
  )
}
