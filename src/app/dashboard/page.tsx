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

// Define allowed user structure
interface AllowedUser {
  userId: string
  editor: boolean
}

// Define shape of saving data
interface SavingData {
  uuid: string | null
  selectedSaving: string | null
  description: string | null
  totalSaved: number | null
  monthlyDeposited: number | null
  nextCounting: string | null
  currency: string | null
  signedAllowedUsers: AllowedUser[] | null
}

// Define structure of an item
export interface ItemData {
  itemId: string
  itemName: string | null
  link: string | null
  price: number | null
  endDate: string | null  
  saved: number | null
  priority: number | null
}

// Function to calculate the end date for saving an item
function calculateEndDate(
  price: number,
  saved: number,
  monthlyDeposited: number,
  priority: number
): string {
  const nowMs = Date.now()
  const remainingPrice = price - saved
  const priorityInMoney = (monthlyDeposited * priority) / 100
  const monthsToAchieve = remainingPrice / priorityInMoney
  const monthInMs = 2629746000
  const restMonthsMs = Math.floor(monthInMs * monthsToAchieve)
  const endDateMs = restMonthsMs + nowMs
  // Return "9999-12-31" if calculation is invalid
  return (restMonthsMs === Infinity || isNaN(restMonthsMs))
        ? "9999-12-31T23:59:59.999Z"
        : new Date(endDateMs).toISOString()
}

// Function to recalculate priority for existing items when adding a new item
function calculatePriority(
  newItemPriority: number, // priority of the new item
  originalPriorityOfExitingItem: number // current priority of existing item
): number {
  return Math.round((100 - newItemPriority) * originalPriorityOfExitingItem) / 100
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)

  // State for main saving data
  const [savingData, setSavingData] = useState<SavingData | null>(null)

  // State for items (original copy and working copy)
  const [itemsDataCopy, setItemsDataCopy] = useState<ItemData[]>([])
  const [itemsData, setItemsData] = useState<ItemData[]>([])

  // State to control visibility of the "New Item" form
  const [newItemVisible, setNewItemVisible] = useState<boolean>(false)

  // State for new item being added
  const [newItemToSave, setNewItemToSave] = useState<ItemData | null>(null)

  const [bottomSheetogleState, setBottomSheetogleState] = useState<boolean>(true)

  // -----------------------------------------
  // Update items priorities and end dates when a new item is added
  // -----------------------------------------
  useEffect(() => {
    if (newItemVisible === true) {
      setItemsData(prevItems => {
        const itemsCopy = prevItems.map(item => ({ ...item }))

        if (newItemToSave && newItemToSave.priority !== null) {
          itemsCopy.forEach((item, index) => {
            // Recalculate priority for each existing item
            item.priority = calculatePriority(
              newItemToSave?.priority ?? 0,
              itemsDataCopy[index]?.priority ?? 0
            )
            // Recalculate end date for each item
            item.endDate = calculateEndDate(
              itemsDataCopy[index]?.price ?? 0,
              itemsDataCopy[index]?.saved ?? 0,
              savingData?.monthlyDeposited ?? 0,
              item.priority ?? 0
            )
          })
        }
        return itemsCopy
      })
    } else {
      // If new item form is canceled and closed, restore original items
      setItemsData(itemsDataCopy)
    }
  }, [newItemToSave, itemsDataCopy, savingData?.monthlyDeposited, newItemVisible])

  // -----------------------------------------
  // Fetch saving data and items on first load
  // -----------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) {
        setSavingData(null)
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
            display_name: currentUser.displayName || "Anonymous",
          }),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error("Backend returned error:", text)
          return
        }

        const data = await res.json()

        // Set main saving data
        setSavingData({
          uuid: data.uuid || null,
          selectedSaving: data.selectedSavingName || null,
          description: data.description || null,
          totalSaved: data.totalSaved || null,
          monthlyDeposited: data.monthlyDeposited || null,
          nextCounting: data.nextCounting || null,
          currency: data.currency || null,
          signedAllowedUsers: data.allowedUsers || null
        })

        // Set items data
        setItemsData(data.itemsData || [])
        setItemsDataCopy(data.itemsData || [])

      } catch (err) {
        console.error("Backend error:", err)
      }
    })

    return () => unsubscribe()
  }, [user])

  // -----------------------------------------
  // Function to send data of new item to backend 
  // -----------------------------------------
  async function sendNewItemToBackend() {

    // Getting the current user from Firebase Auth
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error("No user is signed in.")
      return
    }

    try {
      // Get token (uses cache, doesn't create new one if valid)
      const idToken = await currentUser.getIdToken()

      // Sending data to the backend
      const res = await fetch("/api/savings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          savingUuId: savingData?.uuid ?? "",
          newItem: newItemToSave,
          items: itemsData
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Backend returned error:", text)
        return
      }

      const data = await res.json()
      console.log("Backend response:", data)

      // You can update your status here if you want.
      // e.g. add a new item to itemsData or itemsDataCopy
      if (data.itemsData) {

        setItemsData(data.itemsData) 
        setItemsDataCopy(data.itemsData)
      }

    } catch (err) {
      console.error("Error sending new item:", err)
    }
  }


  return (
    <div className="base-container">
      <Header />
      <div className="main-container-after-loging">
        {/* Main savings details component */}
        <MainSavingsDetails 
          savingData={savingData} 
          setNewItemVisible={setNewItemVisible} 
        />

        {/* New Item form */}
        {newItemVisible && (
          <NewItem
            setBottomSheetogleState={setBottomSheetogleState}
            setNewItemVisible={setNewItemVisible} 
            setNewItemToSave={setNewItemToSave}
            calculateEndDate={calculateEndDate}
            monthlyDeposited={savingData?.monthlyDeposited} 
            sendNewItemToBackend={sendNewItemToBackend}
          />
        )}

        {/* Render list of items */}
        {itemsData.map(item => (
          <ItemDetails 
            key={item.itemId} 
            item={item} 
            monthlyDeposited={savingData?.monthlyDeposited} 
          />
        ))}
        {newItemVisible && (<div className={(bottomSheetogleState) ? "heightOnBottomOpen" : "heightOnBottomColapsed"}>
          &nbsp;
        </div>)}
      </div>
    </div>
  )
}
