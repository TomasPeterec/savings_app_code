'use client' // required for React interactivity

import Header from '@/components/Header'
import { inputField, buttonRegister, buttonRegisterMuted } from "@/styles/ui"
import { useState, useEffect } from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";

import { auth } from "@/firebase/firebase"




export default function RegistrationPage() {
  const [ email, setEmail ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ confirmpassword, setConfirmpassword ] = useState<string>('')
  const [ displayname, setDisplayname ] = useState<string>('')
  const [ samePassword, setSamePassword] = useState<boolean>(false)
  const [ regButtonMuted, setRegButtonMuted ] = useState<boolean>(true)

  const checkAllFields = () => {
    const allFieldsFilled = email !== '' && password !== '' && confirmpassword !== '' && displayname !== ''
    setRegButtonMuted(!(allFieldsFilled && samePassword))
  }


  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setSamePassword(value === confirmpassword)
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmpassword(value)
    setSamePassword(password === value)
  }

  const handleRegister = async () => {
    if (!regButtonMuted) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: displayname,
        });

        console.log("User created successfully:", user);
        alert(`User ${displayname} registered successfully!`);

        await sendEmailVerification(user);

        // clean form
        setEmail('');
        setPassword('');
        setConfirmpassword('');
        setDisplayname('');
      } catch (error: any) {
        console.error("Registration error:", error.message);
        alert(error.message);
      }
    } else {
      console.log("Can't be registered");
    }
  };



  useEffect(() => {
    checkAllFields();
  }, [email, password, confirmpassword, displayname, samePassword]);


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
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={inputField}
          />
          Confirm your password
          {/* email input */}
          <input
            placeholder='Confirm Password'
            value={confirmpassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            className={inputField}
          />
          {samePassword ? "both passwords are the same" : "both passwords must be the same"}
          <br/>
          Display name
          {/* email input */}
          <input
            placeholder='Displayname'
            value={displayname}
            onChange={(e) => setDisplayname(e.target.value)}
            className={inputField}
          />
          <br/>
          <br/>
          <button
            onClick={handleRegister}
            className={!regButtonMuted ? buttonRegister : buttonRegisterMuted}
          >
            Register
          </button>
          
        </p>
      </main>
    </div>
  )
}

