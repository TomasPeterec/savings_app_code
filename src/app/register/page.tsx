'use client' // required for React interactivity

import Header from '@/components/Header'
import {
  container,
  mainContent,
  heading,
  paragraph,
  inputField,
  buttonRegister,
  buttonRegisterMuted,
} from "@/styles/ui"
import { useState, useEffect, useCallback } from 'react'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, User } from "firebase/auth"
import { auth } from "@/firebase/firebase"

export default function RegistrationPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmpassword, setConfirmpassword] = useState<string>('')
  const [displayname, setDisplayname] = useState<string>('')
  const [samePassword, setSamePassword] = useState<boolean>(false)
  const [regButtonMuted, setRegButtonMuted] = useState<boolean>(true)

  const checkAllFields = useCallback(() => {
    const allFieldsFilled =
      email !== '' && password !== '' && confirmpassword !== '' && displayname !== ''
    setRegButtonMuted(!(allFieldsFilled && samePassword))
  }, [email, password, confirmpassword, displayname, samePassword])

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setSamePassword(value === confirmpassword)
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmpassword(value)
    setSamePassword(password === value)
  }

  const handleRegister = async () => {
    if (regButtonMuted) {
      console.log("Can't be registered")
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user: User = userCredential.user

      await updateProfile(user, { displayName: displayname })

      console.log("User created successfully:", user)
      alert(`User ${displayname} registered successfully!`)

      await sendEmailVerification(user)

      // Clean form
      setEmail('')
      setPassword('')
      setConfirmpassword('')
      setDisplayname('')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Registration error:", message)
      alert(message)
    }
  }

  useEffect(() => {
    checkAllFields()
  }, [checkAllFields])

  return (
    <div className={container}>
      <Header />

      <main className={mainContent}>
        <h1 className={heading}>Welcome to Register page</h1>

        <div className={paragraph}>
          <label>
            Input your email
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputField}
            />
          </label>

          <label>
            Set strong password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={inputField}
            />
          </label>

          <label>
            Confirm your password
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className={inputField}
            />
          </label>

          <p className="text-sm text-red-600">
            {samePassword ? "Both passwords are the same" : "Both passwords must be the same"}
          </p>

          <label>
            Display name
            <input
              placeholder="Displayname"
              value={displayname}
              onChange={(e) => setDisplayname(e.target.value)}
              className={inputField}
            />
          </label>
          <div><br/></div>
          <button
            onClick={handleRegister}
            className={!regButtonMuted ? buttonRegister : buttonRegisterMuted}
          >
            Register
          </button>
        </div>
      </main>
    </div>
  )
}
