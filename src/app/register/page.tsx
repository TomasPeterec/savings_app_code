'use client' // required for React interactivity

import Header from '@/components/Header'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  User,
} from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { myEmailValidation, validatePassword } from '@/components/lib/emailValidation'
import '@/styles/theme.css' // import new CSS

export default function RegistrationPage() {
  const router = useRouter()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmpassword, setConfirmpassword] = useState<string>('')
  const [displayname, setDisplayname] = useState<string>('')
  const [samePassword, setSamePassword] = useState<boolean>(true)
  const [regButtonMuted, setRegButtonMuted] = useState<boolean>(true)
  const [emailError, setEmailError] = useState<string>('')
  const [newPasswordError, setNewPasswordError] = useState<string>('')

  const checkAllFields = useCallback(() => {
    const allFieldsFilled =
      email !== '' &&
      password !== '' &&
      confirmpassword !== '' &&
      displayname !== ''
    setRegButtonMuted(!(allFieldsFilled && samePassword))
  }, [email, password, confirmpassword, displayname, samePassword])

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setEmailError(myEmailValidation(value))
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setSamePassword(value === confirmpassword)
    setNewPasswordError(validatePassword(value))
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmpassword(value)
    setSamePassword(password === value)
  }

  const handleRegister = async () => {
    if (regButtonMuted) return

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user: User = userCredential.user

      await updateProfile(user, { displayName: displayname })
      alert(`User ${displayname} registered successfully!`)

      await sendEmailVerification(user)

      // Reset form
      setEmail('')
      setPassword('')
      setConfirmpassword('')
      setDisplayname('')
      router.push("/verify-email")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Registration error:', message)
      alert(message)
    }
  }

  useEffect(() => {
    checkAllFields()
  }, [checkAllFields])

  return (
    <div className="base-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">Welcome to the Registration Page</h1>
      </div>

      <div className="actions-section">
        <div className="form-card">

          {/* Email */}
          <label>
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label">Enter your email</p>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="input-field"
              autoComplete="off"
            />
            <div className="form-half-separator-down">
              <p className="field-message">{emailError || <span>&nbsp;</span>}</p>
            </div>
          </label>

          {/* Password */}
          <label>
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label">Set a strong password</p>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="input-field"
              autoComplete="new-password"
            />
            <div className="form-half-separator-down">
              <p className="field-message">{newPasswordError || <span>&nbsp;</span>}</p>
            </div>
          </label>

          {/* Confirm Password */}
          <label>
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label">Confirm your password</p>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className="input-field"
              autoComplete="new-password"
            />
            <div className="form-half-separator-down">
              <p className="field-message">
                {samePassword ? <span>&nbsp;</span> : 'Both passwords must match'}
              </p>
            </div>
          </label>

          {/* Display Name */}
          <label>
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label">Display name</p>
            </div>
            <input
              placeholder="Display name"
              value={displayname}
              onChange={(e) => setDisplayname(e.target.value)}
              className="input-field"
            />
            <div className="form-half-separator-down">
              <p className="field-message">
                {email && !displayname ? 'Display name must be set' : <span>&nbsp;</span>}
              </p>
            </div>
            <div className="form-half-separator-up vertical-align-bottom">
              <br />
            </div>
          </label>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className={!regButtonMuted ? 'button-primary' : 'button-primary-muted'}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}
