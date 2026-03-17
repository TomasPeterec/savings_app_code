"use client"
import { useState } from "react"
import "@/styles/theme.css"

type MenuState = { [key: string]: boolean | null }

type colapsMenuType = {
  label: string
  path: string
  submenu: { label: string; path: string }[]
}

type Props = {
  items: colapsMenuType[]
  navigateAfterClose: (path: string) => void
}

export default function ColapsableMenu({ items, navigateAfterClose }: Props) {
  const [menuOpen, setMenuOpen] = useState<MenuState>(() => {
    const state: MenuState = {}
    items.forEach(item => {
      state[item.label] = item.submenu.length > 0 ? false : null
    })
    return state
  })

  return (
    <>
      {items.map(item => (
        <div key={item.label}>
          <button
            className="menu-item-button"
            onClick={() => {
              if (item.submenu.length === 0) {
                navigateAfterClose(item.path)
              } else {
                setMenuOpen(prev => {
                  const newState: MenuState = {}
                  Object.keys(prev).forEach(key => {
                    newState[key] = false
                  })
                  newState[item.label] = !prev[item.label]
                  return newState
                })
              }
            }}
          >
            {item.label}
          </button>

          {item.submenu.length > 0 && menuOpen[item.label] && (
            <div className="submenu">
              {item.submenu.map(sub => (
                <button
                  key={sub.label}
                  className="menu-item-button submenu-item-button"
                  onClick={() => navigateAfterClose(sub.path)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
