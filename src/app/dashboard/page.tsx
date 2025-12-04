"use client"

import { useEffect, useState } from "react"
import Header from "@/components/Header"
import { auth } from "@/firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useAuthStore } from "@/store/authStore"
import "@/styles/theme.css"
import MainSavingsDetails from "@/components/MainSavingsDetails"
import ItemDetails from "@/components/ItemDetails"
import NewItem from "@/components/NewItem"

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

export interface ItemData {
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
  const [itemsDataCopy, setItemsDataCopy] = useState<ItemData[]>([])
  const [itemsData, setItemsData] = useState<ItemData[]>([])
  const [newItemVisible, setNewItemVisible] = useState<boolean>(false)
  const [newItemToArr, setNewItemToArr] = useState<ItemData | null>(null)


  useEffect(() => {
    setItemsData(prevItems => {
      const itemsCopy = prevItems.map((item) => ({ ...item }))
      const newItemPriority = newItemToArr?.priority ?? 0

      if (newItemToArr && newItemToArr.priority !== null) {
        itemsCopy.forEach((item, index) => {
          const originalPriority = itemsDataCopy[index]?.priority ?? 0
          item.priority = Math.round((100 - newItemPriority) * originalPriority) / 100
        });
      }

      return itemsCopy
    })
  }, [newItemToArr, itemsDataCopy])






  // first load from backend
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
          currency: data.currency || null,  
          signedAllowedUsers: data.allowedUsers || null
        })

        setItemsData(data.itemsData || [])
        setItemsDataCopy(data.itemsData || [])


      } catch (err) {
        console.error("Backend error:", err)
      }
    })

    return () => unsubscribe()
  }, [user])



  const writeData = () => {
    console.log(itemsData)
  }


  return (
    <div className="base-container">
      <Header />
      <div className="main-container-after-loging">
        <MainSavingsDetails 
          savingData={savingData} 
          setNewItemVisible={setNewItemVisible} 
        />
        {newItemVisible ? (<NewItem
              setNewItemVisible={setNewItemVisible} 
              writeData={writeData}
              setNewItemToArr={setNewItemToArr}
        />) : null
            
        }
        {itemsData.map(item => (
          <ItemDetails key={item.itemId} item={item} monthlyDeposited={savingData?.monthlyDeposited} />
        ))}
      </div>
    </div>
  )
}
