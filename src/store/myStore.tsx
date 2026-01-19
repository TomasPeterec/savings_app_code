"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface MyState {
  myNumber: number | null
  setMyNumber: (myNumber: number | null) => void
}

const isClient = typeof window !== "undefined"

export const useMyStore = create<MyState>()(
  persist(
    set => ({
      myNumber: null,
      setMyNumber: myNumber => set({ myNumber }),
    }),
    {
      name: "my-storage",
      // only use storage on client
      storage: isClient ? createJSONStorage(() => localStorage) : undefined,
    }
  )
)
