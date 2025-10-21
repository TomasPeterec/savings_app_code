'use client' // required for React interactivity

import { header, headerTitle, headerButton } from "@/styles/ui"
import { useAuthStore } from "@/store/authStore"
import { auth, } from "@/firebase/firebase"
import { signOut as firebaseSignOut } from "firebase/auth"
import { useRouter } from "next/navigation"

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
    <header className={header}>
      {/* Logo or app name */}
      <h1 className={headerTitle}>SporenieApp</h1>

      {/* Sign out button, only visible when needed */}
      {user && (
        <button onClick={signOut} className={headerButton}>
          Sign out
        </button>
      )}
    </header>
  )
}
