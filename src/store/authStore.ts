"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { User } from "firebase/auth"

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const isClient = typeof window !== "undefined"

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      // only use storage on client
      storage: isClient ? createJSONStorage(() => localStorage) : undefined,
    }
  )
)
