"use client"

import { useEffect, useState } from "react"
import Header from "@/components/Header"
import { auth } from "@/firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useAuthStore } from "@/store/authStore"
import "@/styles/theme.css"
import MainSavingsDetails from "@/components/MainSavingsDetails"
import ItemDetails from "@/components/ItemDetails"

// Define the shape of the saving data object
interface AllowedUser {
  userId: string
  editor: boolean
}

interface SavingData {
  selectedSaving: string | null
  description: string | null
  totalSaved: number | null
  monthlyDeposited: number | null
  nextCounting: string | null
  currency: string | null
  signedAllowedUsers: AllowedUser[] | null
}

interface ItemData {
  itemId: string
  itemName: string | null
  link: string | null
  price: number | null
  endDate: string | null  
  saved: number | null
  priority: number | null
}




export default function Dashboard() {
  const user = useAuthStore((state) => state.user)

 
  const [savingData, setSavingData] = useState<SavingData | null>(null)
  const [itemsData, setItemsData] = useState<ItemData[]>([])


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
       
        setSavingData(null) // reset all saving data at once
        return
      }

      const idToken = await currentUser.getIdToken()
     

      try {
        const res = await fetch("/api/savings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            email: currentUser.email,
            display_name: currentUser.displayName || "Anonymous", // fallback if null
          }),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error("Backend returned error:", text)
          return
        }

        const data = await res.json()

        // set all saving data at once
        setSavingData({
          selectedSaving: data.selectedSavingName || null,
          description: data.description || null,
          totalSaved: data.totalSaved || null,
          monthlyDeposited: data.monthlyDeposited || null,
          nextCounting: data.nextCounting || null,
          currency: data.currency || null,  // <- tu musí byť čiarka
          signedAllowedUsers: data.allowedUsers || null
        })

        setItemsData(data.itemsData || [])


      } catch (err) {
        console.error("Backend error:", err)
      }
    })

    return () => unsubscribe()
  }, [user])

  return (
    <div className="base-container">
      <Header />
      <div className="main-container-after-loging">
        <MainSavingsDetails savingData={savingData} />
        {itemsData.map(item => (
          <ItemDetails key={item.itemId} item={item} />
        ))}
      </div>
    </div>
  )
}
