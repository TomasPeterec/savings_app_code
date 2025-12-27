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
  originalPriorityOfExitingItem: number, // current priority of existing item
  prevSlidingPriority: number,
  itemCount: number // previous priority of the new item
): number {
  return (prevSlidingPriority !== 100) ? 
  Math.round((100 - newItemPriority) * originalPriorityOfExitingItem) / 100 :
  Math.round((100 - newItemPriority) / itemCount)
}

const EMPTY_ITEM: ItemData = {
  itemId: "",
  itemName: "",
  link: "",
  price: 0,
  saved: 0,
  endDate: new Date().toISOString(),
  priority: 0,
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)

  // State for main saving data
  const [savingData, setSavingData] = useState<SavingData | null>(null)

  // State for items (original copy and working copy)
  const [itemsDataCopy2, setItemsDataCopy2] = useState<ItemData[]>([])
  const [itemsDataCopy, setItemsDataCopy] = useState<ItemData[]>([])
  const [itemsData, setItemsData] = useState<ItemData[]>([])

  // State to control visibility of the "New Item" form
  const [newItemVisible, setNewItemVisible] = useState<boolean>(false)

  // State for new item being added
  const [newItemToSave, setNewItemToSave] = useState<ItemData>(EMPTY_ITEM)

  // switching the height of bottom offset regarding whether form in bottomseet is colapsed or not
  const [bottomSheetToogleState, setBottomSheetToogleState] = useState<boolean>(true)

  // State to toggle between adding a new item or editing an existing one
  const [toogleAddOrEdit, setToogleAddOrEdit] = useState<boolean>(true)

  const [prevSlidingPriority, setPrevSlidingPriority] = useState<number>(0)

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
              itemsDataCopy[index]?.priority ?? 0,
              (100 - itemsDataCopy.reduce(
                (sum, item) => sum + (item.priority ?? 0), 0
              )),
              itemsDataCopy.length
            )

            setPrevSlidingPriority(newItemToSave?.priority ?? 0)

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
      setItemsData(itemsDataCopy2)
      setItemsDataCopy(itemsDataCopy2)
    }
  }, [newItemToSave, itemsDataCopy, savingData?.monthlyDeposited, newItemVisible, itemsDataCopy2])

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

        // Set items data
        setItemsData(data.itemsData || [])
        setItemsDataCopy(data.itemsData || [])
        setItemsDataCopy2(data.itemsData || [])
        
        let itemsSum = data.itemsData.reduce(
          (sum: number, item: ItemData) => sum + (item.saved ?? 0), 0
        )

        // Set main saving data
        setSavingData({
          uuid: data.uuid || null,
          selectedSaving: data.selectedSavingName || null,
          description: data.description || null,
          totalSaved: itemsSum,
          monthlyDeposited: data.monthlyDeposited || null,
          nextCounting: data.nextCounting || null,
          currency: data.currency || null,
          signedAllowedUsers: data.allowedUsers || null
        })

      } catch (err) {
        console.error("Backend error:", err)
      }
    })

    return () => unsubscribe()
  }, [user])


  // -------------------------------------------
  // Function for balancing of values in array
  // -------------------------------------------
  function balanceItemsPriorities(balancedArray: ItemData[]): ItemData[] {
    const totalPriority = balancedArray.reduce(
      (sum, item) => sum + (item.priority ?? 0), 0
    );

    // Ak je totalPriority 0, všetky priority necháme 0
    if (totalPriority === 0) {
      return balancedArray.map(item => ({
        ...item,
        priority: 0
      }));
    }

    const ratio = 100 / totalPriority;

    return balancedArray.map(item => ({
      ...item,
      priority: Math.round((item.priority ?? 0) * ratio)
    }));
  }



  // -----------------------------------------
  // Function for temporary removing an ittem from list
  // -----------------------------------------
  function removeItemTemporarily(itemIdToRemove: string) {
    let temporaryList = itemsData.filter(item => item.itemId !== itemIdToRemove)

    temporaryList = balanceItemsPriorities(temporaryList)

    setItemsData(temporaryList)
    setItemsDataCopy(temporaryList)
  }
  

  // -----------------------------------------
  // Function to send data of new item to backend 
  // -----------------------------------------
  async function sendNewItemToBackend(actionType: string) {

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
          actionType: actionType,
          savingUuId: savingData?.uuid ?? "",
          newItem: newItemToSave,
          items: (actionType === "delete") ? 
            balanceItemsPriorities(itemsDataCopy) : 
            itemsData
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Backend returned error:", text)
        return
      }

      const data = await res.json()

      // You can update your status here if you want.
      // e.g. add a new item to itemsData or itemsDataCopy
      if (data.itemsData) {

        setItemsData(data.itemsData) 
        setItemsDataCopy(data.itemsData)
        setItemsDataCopy2(data.itemsData)
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
          setToogleAddOrEdit={setToogleAddOrEdit}
          savingData={savingData} 
          setNewItemVisible={setNewItemVisible} 
        />

        {/* New Item form */}
        {newItemVisible && (
          <NewItem
            setPrevSlidingPriority={setPrevSlidingPriority}
            newItemToSave={newItemToSave}
            toogleAddOrEdit={toogleAddOrEdit}
            setBottomSheetToogleState={setBottomSheetToogleState}
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
            removeItemTemporarily={removeItemTemporarily}
            setNewItemToSave={setNewItemToSave}
            setToogleAddOrEdit={setToogleAddOrEdit}
            setNewItemVisible={setNewItemVisible}
            key={item.itemId} 
            item={item} 
            monthlyDeposited={savingData?.monthlyDeposited} 
          />
        ))}
        {newItemVisible && (<div className={(bottomSheetToogleState) ? 
          "heightOnBottomOpen" : 
          "heightOnBottomColapsed"}
        >
          &nbsp;
        </div>)}
        <div className="defaultBottomOffset">&nbsp;</div>
      </div>
    </div>
  )
}
