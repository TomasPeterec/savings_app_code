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
import EditSaving from "@/components/EditSaving"
import ChangeSaving from "@/components/ChangeSaving"

// Define allowed user structure
interface AllowedUser {
  shortName: string
  userId: string
  editor: boolean
  email: string | null
}

// Define shape of saving data
export interface SavingData {
  uuid: string | null
  selectedSaving: string | null
  description: string | null
  totalSaved: number | null
  monthlyDeposited: number | null
  countingDate: number | null
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
  locked: boolean | null
}

const MAX_DATE_MS = 46_000_000_000_000
const MAX_DATE_ISO = new Date(MAX_DATE_MS).toISOString()
const MIN_DATE_MS = -8.64e15


// Function to calculate the end date for saving an item safely
function calculateEndDate(
  price: number,
  saved: number,
  monthlyDeposited: number,
  priority: number
): string {
  const nowMs = Date.now()

  if (!monthlyDeposited || priority <= 0) {
    return MAX_DATE_ISO
  }

  const remainingPrice = price - saved
  const priorityInMoney = (monthlyDeposited * priority) / 100
  const monthsToAchieve = remainingPrice / priorityInMoney
  const monthInMs = 2629746000
  let endDateMs = nowMs + Math.floor(monthInMs * monthsToAchieve)

  

  // clamp 
  if (!Number.isFinite(endDateMs) || endDateMs > MAX_DATE_MS) endDateMs = MAX_DATE_MS
  if (endDateMs < MIN_DATE_MS) endDateMs = MIN_DATE_MS

  return new Date(endDateMs).toISOString()
}

const EMPTY_ITEM: ItemData = {
  itemId: "",
  itemName: "",
  link: "",
  price: 0,
  saved: 0,
  endDate: new Date().toISOString(),
  priority: 0,
  locked: false,
}

export default function Dashboard() {
  const user = useAuthStore(state => state.user)

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
  const [bottomSheetToggleState, setBottomSheetToggleState] = useState<boolean>(true)

  // State to toggle between adding a new item or editing an existing one
  const [toggleAddOrEdit, setToggleAddOrEdit] = useState<boolean>(true)
  const [togleEditSaving, setToggleEditSaving] = useState<boolean>(false)
  const [actualSliderClamp, setActualSliderClamp] = useState<number>(0)

  // toggle visibility of ChangeSaving bottomsheet
  const [toggleChangeSaving, setToggleChangeSaving] = useState<boolean>(false)

  // -----------------------------------------
  // Update items priorities and end dates when a new item is added
  // -----------------------------------------
  useEffect(() => {
    if (newItemVisible === true) {
      setItemsData(prevItems => {
        const fullPercent = 100
        const lockedPartPercent = prevItems.reduce((sum, item) => {
          // If item is locked, add its priority to the sum
          if (item.locked) {
            sum += item.priority ?? 0
          }
          return sum
        }, 0)

        const unlockedPercent = prevItems.reduce((sum, item) => {
          // If item is locked, add its priority to the sum
          if (!item.locked) {
            sum += item.priority ?? 0
          }
          return sum
        }, 0)

        const sliderClamp = fullPercent - lockedPartPercent
        setActualSliderClamp(sliderClamp - 0.01)

        const decreasedPercent = fullPercent - lockedPartPercent - (newItemToSave.priority ?? 0)
        const changeRatio = decreasedPercent / unlockedPercent

        const itemsCopy = prevItems.map(item => ({ ...item }))

        if (newItemToSave && newItemToSave.priority !== null) {
          itemsCopy.forEach((item, index) => {
            // Recalculate priority for each existing item
            if (!item.locked) {
              item.priority = (item.priority ?? 0) * changeRatio
            }

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
            Authorization: `Bearer ${idToken}`,
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

        const itemsSum = data.itemsData.reduce(
          (sum: number, item: ItemData) => sum + (item.saved ?? 0),
          0
        )

        // Set main saving data
        setSavingData({
          uuid: data.uuid || null,
          selectedSaving: data.selectedSavingName || null,
          description: data.description || null,
          totalSaved: itemsSum,
          monthlyDeposited: data.monthlyDeposited || null,
          countingDate: data.countingDate || null,
          currency: data.currency || null,
          signedAllowedUsers: data.allowedUsers || null,
        })
      } catch (err) {
        console.error("Backend error:", err)
      }
    })

    return () => unsubscribe()
  }, [user])

  // -----------------------------------------
  // Function for temporary removing an item from list
  // -----------------------------------------
  function removeItemTemporarily(itemIdToRemove: string) {
    const temporaryList = itemsData.filter(item => item.itemId !== itemIdToRemove)
    setItemsData(temporaryList)
    setItemsDataCopy(temporaryList)
  }

  // -----------------------------------------
  // Adjusts unlocked item priorities so that total sums to 100
  // -----------------------------------------
  function adjustPrioritiesToFullPercent(items: ItemData[]): ItemData[] {
    const fullPercent = 100
    const updatedItems = items.map(item => ({ ...item }))
    const unlockedItems = updatedItems.filter(item => !item.locked)

    if (unlockedItems.length === 0) return updatedItems

    const total = updatedItems.reduce((sum, item) => sum + (item.priority ?? 0), 0)
    const difference = total - fullPercent

    if (difference === 0) return updatedItems

    let adjustedItems = updatedItems.map(item => ({ ...item }))

    if (difference > 0) {
      // total > 100 → subtract from HIGHEST priority (unlocked)
      const target = unlockedItems.reduce((max, item) =>
        (item.priority ?? 0) > (max.priority ?? 0) ? item : max
      )
      const idx = adjustedItems.findIndex(i => i.itemId === target.itemId)
      adjustedItems[idx].priority = (adjustedItems[idx].priority ?? 0) - difference
    } else {
      // total < 100 → add to LOWEST priority (unlocked)
      const target = unlockedItems.reduce((min, item) =>
        (item.priority ?? 0) < (min.priority ?? 0) ? item : min
      )
      const idx = adjustedItems.findIndex(i => i.itemId === target.itemId)
      adjustedItems[idx].priority = (adjustedItems[idx].priority ?? 0) - difference
      // difference is negative → effectively adding
    }

    return adjustedItems
  }

  // ----------------------------------------
  // calculation before deleting an item
  // ----------------------------------------
  function restBeforeDeleting(itemSet: ItemData[]): ItemData[] {
    const copiedItems = itemSet.map(item => ({ ...item }))

    const lockedPart = copiedItems.reduce(
      (sum, item) => sum + (item.locked ? (item.priority ?? 0) : 0),
      0
    )
    const unlockedPart = copiedItems.reduce(
      (sum, item) => sum + (item.locked ? 0 : (item.priority ?? 0)),
      0
    )
    const ratio = unlockedPart > 0 ? (100 - lockedPart) / unlockedPart : 1

    const scaledItems = copiedItems.map(item => ({
      ...item,
      priority: item.locked ? item.priority : (item.priority ?? 0) * ratio,
    }))

    return adjustPrioritiesToFullPercent(scaledItems)
  }

  // -----------------------------------------
  // Function to send data of new item to backend
  // -----------------------------------------
  async function sendNewItemToBackend(actionType: string) {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error("No user is signed in.")
      return
    }

    try {
      const idToken = await currentUser.getIdToken()

      // TU sprav sanitizaciu endDate
      const sanitizedItems = itemsData.map(item => ({
        ...item,
        endDate: item.endDate ? new Date(item.endDate).toISOString() : new Date().toISOString(),
      }))

      const sanitizedNewItem = {
        ...newItemToSave,
        endDate: newItemToSave.endDate
          ? new Date(newItemToSave.endDate).toISOString()
          : new Date().toISOString(),
      }

      const res = await fetch("/api/savings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          actionType: actionType,
          savingUuId: savingData?.uuid ?? "",
          newItem: sanitizedNewItem,
          items: actionType === "delete" ? restBeforeDeleting(sanitizedItems) : sanitizedItems,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Backend returned error:", text)
        return
      }

      const data = await res.json()

      if (data.itemsData) {
        setItemsData(data.itemsData)
        setItemsDataCopy(data.itemsData)
        setItemsDataCopy2(data.itemsData)
      }
    } catch (err) {
      console.error("Error sending new item:", err)
    }
  }

  const updateSavingData = (updated: SavingData) => {
    setSavingData(updated)
  }

  return (
    <div className="base-container">
      <Header />
      <div className="main-container-after-loging">
        <MainSavingsDetails
          setToggleChangeSaving={setToggleChangeSaving}
          setToggleEditSaving={setToggleEditSaving}
          setToggleAddOrEdit={setToggleAddOrEdit}
          savingData={savingData}
          setNewItemVisible={setNewItemVisible}
        />

        {newItemVisible && (
          <NewItem
            itemsDataLength={itemsData.length}
            setActualSliderClamp={setActualSliderClamp}
            actualSliderClamp={actualSliderClamp}
            newItemToSave={newItemToSave}
            toggleAddOrEdit={toggleAddOrEdit}
            setBottomSheetToggleState={setBottomSheetToggleState}
            setNewItemVisible={setNewItemVisible}
            setNewItemToSave={setNewItemToSave}
            calculateEndDate={calculateEndDate}
            monthlyDeposited={savingData?.monthlyDeposited}
            sendNewItemToBackend={sendNewItemToBackend}
          />
        )}

        {toggleChangeSaving && (
          <ChangeSaving
            setToggleChangeSaving={setToggleChangeSaving}
            setSavingData={setSavingData}
            setItemsData={setItemsData}
            setItemsDataCopy={setItemsDataCopy}
            setItemsDataCopy2={setItemsDataCopy2}
          />
        )}

        {togleEditSaving && (
          <EditSaving
            savingData={savingData}
            setToggleEditSaving={setToggleEditSaving}
            mainUserId={user?.uid ?? null}
            auth={auth}
            updateParentSavingData={updateSavingData}
          />
        )}

        {itemsData.map(item => (
          <ItemDetails
            removeItemTemporarily={removeItemTemporarily}
            setNewItemToSave={setNewItemToSave}
            setToggleAddOrEdit={setToggleAddOrEdit}
            setNewItemVisible={setNewItemVisible}
            key={item.itemId}
            item={item}
            monthlyDeposited={savingData?.monthlyDeposited}
          />
        ))}

        {newItemVisible && (
          <div className={bottomSheetToggleState ? "heightOnBottomOpen" : "heightOnBottomColapsed"}>
            &nbsp;
          </div>
        )}

        <div className="defaultBottomOffset">&nbsp;</div>
      </div>
    </div>
  )
}
