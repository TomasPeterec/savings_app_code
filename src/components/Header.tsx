"use client"

import { useAuthStore } from "@/store/authStore"
import { auth } from "@/firebase/firebase"
import { signOut as firebaseSignOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
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
    { label: "Friends", path: "/friends", submenu: [] },
    {
      label: "Settings",
      path: "",
      submenu: [
        { label: "Profile", path: "/settings/profile" },
        { label: "Change Password", path: "/settings/change-password" },
        { label: "Notifications", path: "/settings/notifications" },
      ],
    },
  ]

  type MenuState = { [key: string]: boolean | null }

  // inicialisation of calasing state for menu items with submenu (true = open, false = closed, null = no submenu)
  const [authMenuOpen, setAuthMenuOpen] = useState<MenuState>(() => {
    const state: MenuState = {}
    authMenuItems.forEach(item => {
      if (item.submenu.length > 0) {
        state[item.label] = false // submenu does exist, colapsed
      } else {
        state[item.label] = null // submenu does not exist, no state needed
      }
    })
    return state
  })

  const commonMenuItems: colapsMenuType[] = [
    {
      label: "Learn",
      path: "",
      submenu: [
        { label: "About", path: "/about" },
        { label: "Tutorials", path: "/tutorials" },
        { label: "FAQ", path: "/faq" },
      ],
    },
    {
      label: "Contact",
      path: "/contact",
      submenu: [],
    },
  ]

  const [commonMenuOpen, setCommonMenuOpen] = useState<MenuState>(() => {
    const state: MenuState = {}

    commonMenuItems.forEach(item => {
      if (item.submenu.length > 0) {
        state[item.label] = false
      } else {
        state[item.label] = null
      }
    })

    return state
  })

  const legalMenuItems: colapsMenuType[] = [
    { label: "Terms of Service", path: "/terms", submenu: [] },
    { label: "Privacy Policy", path: "/privacy", submenu: [] },
  ]

  const [legalMenuOpen, setLegalMenuOpen] = useState<MenuState>(() => {
    const state: MenuState = {}

    legalMenuItems.forEach(item => {
      if (item.submenu.length > 0) {
        state[item.label] = false
      } else {
        state[item.label] = null
      }
    })

    return state
  })

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

        {user &&
          authMenuItems.map(item => (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (item.submenu.length === 0) {
                    navigateAfterClose(item.path)
                  } else {
                    setAuthMenuOpen(prev => {
                      const newState: MenuState = {}

                      Object.keys(prev).forEach(key => {
                        newState[key] = false
                      })

                      newState[item.label] = !prev[item.label]

                      return newState
                    })
                  }
                }}
                className="menu-item-button"
              >
                {item.label}
              </button>
              {item.submenu.length > 0 && (
                <div
                  className="submenu"
                  style={{ display: authMenuOpen[item.label] ? "block" : "none" }}
                >
                  {item.submenu.map(sub => (
                    <button
                      key={sub.label}
                      onClick={() => navigateAfterClose(sub.path)}
                      className="submenu-item-button"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        <br />
        <div className="menu-separator"></div>
        {commonMenuItems.map(item => (
          <div key={item.label}>
            <button
              onClick={() => {
                if (item.submenu.length === 0) {
                  navigateAfterClose(item.path)
                } else {
                  setCommonMenuOpen(prev => {
                    const newState: MenuState = {}

                    Object.keys(prev).forEach(key => {
                      newState[key] = false
                    })

                    newState[item.label] = !prev[item.label]

                    return newState
                  })
                }
              }}
              className="menu-item-button"
            >
              {item.label}
            </button>
            {item.submenu.length > 0 && (
              <div
                className="submenu"
                style={{ display: commonMenuOpen[item.label] ? "block" : "none" }}
              >
                {item.submenu.map(sub => (
                  <button
                    key={sub.label}
                    onClick={() => navigateAfterClose(sub.path)}
                    className="submenu-item-button"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <br />
        <div className="menu-separator"></div>
        <br />
        {legalMenuItems.map(item => (
          <div key={item.label}>
            <button
              onClick={() => {
                if (item.submenu.length === 0) {
                  navigateAfterClose(item.path)
                } else {
                  setLegalMenuOpen(prev => {
                    const newState: MenuState = {}

                    Object.keys(prev).forEach(key => {
                      newState[key] = false
                    })

                    newState[item.label] = !prev[item.label]

                    return newState
                  })
                }
              }}
              className="menu-item-button"
            >
              {item.label}
            </button>
            {item.submenu.length > 0 && (
              <div
                className="submenu"
                style={{ display: legalMenuOpen[item.label] ? "block" : "none" }}
              >
                {item.submenu.map(sub => (
                  <button
                    key={sub.label}
                    onClick={() => navigateAfterClose(sub.path)}
                    className="submenu-item-button"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))} 
        <br />
        <div className="menu-separator"></div>
        <br />
        {user ? (
          <div>
            {/* Sign out button */}
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
      </div>
    </header>
  )
}
