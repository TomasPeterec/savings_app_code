'use client' // required for React interactivity

import Header from '@/components/Header'
import { inputField, buttonRegister } from "@/styles/ui"
import { useState } from 'react'


export default function Dashboard() {
  const [email, setEmail] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ confirmpassword, setConfirmpassword ] = useState<string>('')
  const [ displayname, setDisplayname ] = useState<string>('')

  const handleRegister = () => {
    console.log("Email:", email)
    console.log("Display Name:", displayname)
    console.log("Password:", password)
    console.log("Confirm Password:", confirmpassword)
  }
  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome to Register page
        </h1>
        <p className="text-gray-700 text-center max-w-md">
          Imput your mail
          {/* email input */}
          <input 
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputField}
          />
          Set strong password
          {/* email input */}
          <input 
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputField}
          />
          Confirm your password
          {/* email input */}
          <input
            placeholder='Confirm Password'
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            className={inputField}
          />
          Display name
          {/* email input */}
          <input
            placeholder='Displayname'
            value={displayname}
            onChange={(e) => setDisplayname(e.target.value)}
            className={inputField}
          />
          <button
            onClick={handleRegister}
            className={buttonRegister}
          >
            Register
          </button>
          
        </p>
      </main>
    </div>
  )
}

