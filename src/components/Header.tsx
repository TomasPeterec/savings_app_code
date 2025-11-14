'use client' // required for React interactivity

import { useAuthStore } from "@/store/authStore"
import { auth, } from "@/firebase/firebase"
import { signOut as firebaseSignOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import "@/styles/theme.css" // import noveho CSS


export default function Header() {

  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const router = useRouter()
  

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
          {/* Sign out button, only visible when needed */}
          {user && (
          <button onClick={signOut} className="header-button">
            Sign out
          </button> 
        )}
        <img className="burger-menu" 
          src="/icons/burherMenu.svg" 
          alt="Dream Save Logo" />
        </div>
      </div>
      <div className="header-separator"></div>
    </header>
  )
}
