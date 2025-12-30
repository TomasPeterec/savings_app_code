'use client' // required for React interactivity

import { useAuthStore } from "@/store/authStore"
import { auth, } from "@/firebase/firebase"
import { signOut as firebaseSignOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import "@/styles/theme.css" // import noveho CSS


export default function Header() {

  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const router = useRouter()

  const [openSliderMenu, setOpenSliderMenu] = useState<boolean>(false)
  

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)

      // Add your Firebase signOut logic here
      console.log("Signing out...")
      router.push("/")
    } catch (error) {
      console.error("Sign Out Error:", error)
    }
  }

  return (
    <header className="header">
      {/* Logo or app name */}
      <div className="header-content">
        <div className="logo-box">
          <img className="header-logo" 
          src="/images/DreamSaveLogo.svg" 
          alt="Dream Save Logo" />
        </div>
        <div>
        </div>
        <div className="menu-box">
          <button 
            className="burger-menu-button"
            onClick={() => setOpenSliderMenu(true)}
          >
            <img className="burger-menu" 
              src="/icons/burgerMenu.svg" 
              alt="Dream Save Logo" 
            />
          </button>
        </div>
      </div>
      <div className="header-separator"></div>
      <div 
        className={`sliding-menu ${openSliderMenu ? "open" : ""}`}
      >
        <button 
          className="burger-menu-button"
          onClick={() => setOpenSliderMenu(false)}
        >
          <img className="burger-menu" 
            src="/icons/close.svg" 
            alt="Dream Save Logo" 
          />
        </button>
        {/* Sign out button, only visible when needed */}
        {user && (
          <button onClick={() => {
            setTimeout(() => signOut(), 300);
            setOpenSliderMenu(false)}} 
            className="sign-out-button"
          >
            Sign out
          </button> 
        )}
      </div>
    </header>
  )
}
