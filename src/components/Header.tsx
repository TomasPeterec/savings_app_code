"use client"

import { useAuthStore } from "@/store/authStore"
import { auth } from "@/firebase/firebase"
import { signOut as firebaseSignOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import ColapsableMenu from "./ColapsableMenu"
import "@/styles/theme.css"

export default function Header() {
  const user = useAuthStore(state => state.user)
  const setUser = useAuthStore(state => state.setUser)
  const router = useRouter()

  const [openSliderMenu, setOpenSliderMenu] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  type colapsMenuType = {
    label: string
    path: string
    submenu: { label: string; path: string }[]
  }

  const authMenuItems: colapsMenuType[] = [
    { label: "Dashboard", path: "/dashboard", submenu: [] },
    {
      label: "Settings",
      path: "",
      submenu: [
        { label: "Profile", path: "/settings/profile" },
        { label: "Change Password", path: "/settings/change-password" },
        { label: "Cancel Account", path: "/settings/cancel-account" },
      ],
    },
  ]

  const commonMenuItems: colapsMenuType[] = [
    { label: "About", path: "/about", submenu: [] },
    {
      label: "Learn",
      path: "",
      submenu: [
        { label: "Getting Started", path: "/learn/getting-started" },
        { label: "Features", path: "/learn/features" },
        { label: "Tutorials", path: "/learn/tutorials" },
        { label: "FAQ", path: "/learn/faq" },
        { label: "Tips @ Best Practices", path: "/learn/tips" },
      ],
    },
    {
      label: "Contact",
      path: "/contact",
      submenu: [],
    },
  ]

  const legalMenuItems: colapsMenuType[] = [
    { label: "Terms of Service", path: "/terms", submenu: [] },
    { label: "Privacy Policy", path: "/privacy", submenu: [] },
  ]

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Sign Out Error:", error)
    }
  }

  // Funkcia pre navigáciu po dokončení animácie menu
  const navigateAfterClose = (path: string) => {
    const menu = menuRef.current
    if (!menu) return

    const handleTransitionEnd = () => {
      router.push(path)
      menu.removeEventListener("transitionend", handleTransitionEnd)
    }

    menu.addEventListener("transitionend", handleTransitionEnd)
    setOpenSliderMenu(false) // spusti zatvorenie menu cez CSS
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-box">
          <img className="header-logo" src="/images/DreamSaveLogo.svg" alt="Dream Save Logo" />
        </div>
        <div></div>
        <div className="menu-box">
          <button className="burger-menu-button" onClick={() => setOpenSliderMenu(true)}>
            <img className="burger-menu" src="/icons/burgerMenu.svg" alt="Open menu" />
          </button>
        </div>
      </div>
      <div className="header-separator"></div>

      {/* Sliding menu */}
      <div ref={menuRef} className={`sliding-menu ${openSliderMenu ? "open" : ""}`}>
        <button className="burger-menu-button" onClick={() => setOpenSliderMenu(false)}>
          <img className="burger-menu" src="/icons/close.svg" alt="Close menu" />
        </button>

        {user && <ColapsableMenu items={authMenuItems} navigateAfterClose={navigateAfterClose} />}
        <br />
        <div className="menu-separator"></div>
        {<ColapsableMenu items={commonMenuItems} navigateAfterClose={navigateAfterClose} />}
        <br />
        <div className="menu-separator"></div>
        <br />
        {<ColapsableMenu items={legalMenuItems} navigateAfterClose={navigateAfterClose} />}
        <br />
        <div className="menu-separator"></div>
        <br />
        {/* start of sign out / sign in buttons  */}
        {user ? (
          <div>
            <button onClick={signOut} className="sign-out-button">
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => navigateAfterClose("/")} className="sign-out-button">
              Sign in
            </button>
            <button onClick={() => navigateAfterClose("/register")} className="sign-out-button">
              Register
            </button>
          </div>
        )}
        {/* end of sign out / sign in buttons  */}
      </div>
    </header>
  )
}
