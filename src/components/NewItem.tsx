"use client"

import "@/styles/SavingDetails.css"
import { useState, useEffect, useRef } from "react"
import { ItemData } from "@/app/dashboard/page"

interface NewItemProps {
  newItemToSave: ItemData
  toogleAddOrEdit: boolean
  setBottomSheetToogleState: (visible: boolean) => void
  setNewItemVisible: (visible: boolean) => void
  setNewItemToSave: (item: ItemData) => void
  monthlyDeposited?: number | null
  sendNewItemToBackend: (actionType: string) => void
  calculateEndDate: (
    price: number,
    saved: number,
    monthlyDeposited: number,
    priority: number
  ) => string
}

export default function NewItem({
  newItemToSave,
  toogleAddOrEdit,
  setBottomSheetToogleState,
  setNewItemVisible,
  setNewItemToSave,
  monthlyDeposited,
  sendNewItemToBackend,
  calculateEndDate
}: NewItemProps) {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [desiredSum, setDesiredSum] = useState<number>(0)
  const [itemLink, setItemLink] = useState<string>("")
  const [priority, setPriority] = useState<number>(0)
  const [endDateforNew, setEndDateforNew] = useState<string>(new Date().toISOString())
  const [toggle, setToggle] = useState<boolean>(true)

  const toggleColapse = () => {
    setToggle(!toggle)
    setBottomSheetToogleState(!toggle)
  }

  // ------------------------------
  // AUTO UPDATE END DATE
  // ------------------------------
  useEffect(() => {
    const newEndDate = calculateEndDate(
      desiredSum,
      0,
      monthlyDeposited ?? 0,
      priority
    )
    setEndDateforNew(newEndDate)
  }, [desiredSum, priority, monthlyDeposited, calculateEndDate])

  // ------------------------------
  // AUTO UPDATE ITEM ARRAY
  // ------------------------------
  useEffect(() => {
    setNewItemToSave({
      itemId: newItemToSave.itemId,
      itemName: name,
      link: itemLink,
      price: desiredSum,
      saved: 0,
      endDate: endDateforNew ? new Date(endDateforNew).toISOString() : new Date().toISOString(),
      priority: priority
    })
  }, [name, itemLink, desiredSum, endDateforNew, priority, setNewItemToSave, newItemToSave.itemId])

  // ------------------------------
  // MANUAL CREATE BTN
  // ------------------------------
  const reset = () => {
    setName("")
    setDescription("")
    setDesiredSum(0)
    setItemLink("")
    setPriority(0)
    setNewItemToSave({
      itemId: "",
      itemName: "",
      link: "",
      price: 0,
      saved: 0,
      endDate: new Date().toISOString(),
      priority: 0
    })
  }

  // Send data to backend and close the bottom sheet
  const startActionToBackend = (actionType: string) => {
    sendNewItemToBackend(actionType)
    reset()
    setNewItemVisible(false)
  }

  // Cancel and close the bottom sheet
  const cancelNewItemDialog = () => {
    reset()
    setNewItemVisible(false)
  }

  //distribute the data of selected item to the form when in edit mode
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!toogleAddOrEdit && newItemToSave && !hasLoadedRef.current) {
      setName(newItemToSave.itemName ?? "")
      setItemLink(newItemToSave.link ?? "")
      setDesiredSum(newItemToSave.price ?? 0)
      setPriority(newItemToSave.priority ?? 0)
      setEndDateforNew(
        newItemToSave.endDate
          ? new Date(newItemToSave.endDate).toISOString()
          : new Date().toISOString()
      )
      hasLoadedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toogleAddOrEdit]); 


  return (
    <div className="saving-details-box s-d-b-new">
      <h3 className="main-savings-details-heading inverseFontColor">
        {(toogleAddOrEdit) ? 
          "Create new item" : 
          `Edit item: ${newItemToSave.itemName}`
        }
      </h3>
      <div className="form-card form-card-n-i">
        <div className="form-half-separator-down separatorTuning01"></div>
        <div className="form-half-separator-down separatorTuning01">
          <div className="visualSeparator">&nbsp;</div>
        </div>

        <div className="colapsable">
          <div className="colapsableSideSpace">
            <button
              className="button-secondary colapseButton"
              onClick={toggleColapse}
            >
              <img
                className="chevron-icone"
                src={`/icons/${toggle ? 
                  'ChevronWideDarkBlueDown' : 
                  'ChevronWideDarkBlueRight'}.svg`
                }
                alt="colaps decolaps"
              />
            </button>
          </div>

          {/* --- START OF OPENED FORM --- */}
          <div className={toggle ? 
            "colapsableCenterOpen" : 
            "colapsableCenterClosed"}
          >
            <label>
              <div className="form-half-separator-up vertical-align-bottom">
                <p className="form-label inverseFontColor">Name</p>
              </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
              <div className="form-half-separator-down"></div>
            </label>

            <label>
              <div className="form-half-separator-up vertical-align-bottom">
                <p className="form-label inverseFontColor">Short description</p>
              </div>
              <input
                type="text"
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
              />
              <div className="form-half-separator-down"></div>
            </label>

            {/* --- DOUBLE ROW --- */}
            <div className="twoInRow">
              <label>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow">
                  <p className="form-label inverseFontColor">Desired sum</p>
                </div>
                <input
                  type="number"
                  value={desiredSum === 0 ? "" : desiredSum}
                  onChange={(e) => {
                    const val = e.target.value
                    setDesiredSum(val === "" ? 0 : Number(val))
                  }}
                  placeholder="0"
                  className="input-field halfOfRow"
                />
                <div className="form-half-separator-down"></div>
              </label>

              <label>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow paddingPlus">
                  <p className="form-label inverseFontColor">End date</p>
                </div>
                <div className="halfOfRow endDate paddingPlus inverseFontColor02">
                  {endDateforNew && (() => {
                    const date = new Date(endDateforNew)
                    const month = date.toLocaleString("en-US", { month: "short" })
                    const year = date.getFullYear()
                    return <>{month}&nbsp;{year}</>
                  })()}
                </div>
              </label>
            </div>

            <label>
              <div className="form-half-separator-up vertical-align-bottom">
                <p className="form-label inverseFontColor">Link to the item</p>
              </div>
              <input
                type="text"
                placeholder="Link to the item"
                value={itemLink}
                onChange={(e) => setItemLink(e.target.value)}
                className="input-field"
              />
              <div className="form-half-separator-down"></div>
            </label>
          </div>
          {/* --- END OF OPENED FORM --- */}

          {/* --- START OF COLLAPSED FORM --- */}
          <div className={toggle ? 
            "colapsableCenterClosed" : 
            "colapsableCenterOpen"}
          >
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label inverseFontColor">Name</p>
            </div>
            <p className="amoutColapsed inverseFontColor02">{name || "Name is not set"}</p>
            <div className="form-half-separator-down separatorLow"></div>

            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label inverseFontColor">Short description</p>
            </div>
            <p className="amoutColapsed inverseFontColor02">{description || "Short description is not set"}</p>
            <div className="form-half-separator-down separatorLow"></div>

            {/* --- DOUBLE ROW --- */}
            <div className="twoInRow">
              <div>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow">
                  <p className="form-label inverseFontColor">Desired sum</p>
                </div>
                <p className="amoutColapsed inverseFontColor02">{desiredSum || 0}</p>
                <div className="form-half-separator-down separatorLow"></div>
              </div>

              <div>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow paddingPlus">
                  <p className="form-label inverseFontColor">End date</p>
                </div>
                <p className="amoutColapsed inverseFontColor02 paddingPlus">
                  {endDateforNew && (() => {
                    const date = new Date(endDateforNew)
                    const month = date.toLocaleString("en-US", { month: "short" })
                    const year = date.getFullYear()
                    return <>{month}&nbsp;{year}</>
                  })()}
                </p>
              </div>
            </div>

            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label inverseFontColor">Link to the item</p>
            </div>
            <p className="amoutColapsed inverseFontColor02">{
              itemLink.slice(0, 27)+"..." || "Link to the item was not set"}
            </p>
            <div className="form-half-separator-down separatorLow"></div>
          </div>
          {/* --- END OF COLLAPSED FORM --- */}

          <div className="colapsableSideSpace">&nbsp;</div>
        </div>

        <div className="form-half-separator-down separatorTuning01">
          <div className="visualSeparator">&nbsp;</div>
        </div>
        <div className="form-half-separator-down separatorTuning01"></div>

        <label>
          <div className="form-half-separator-up vertical-align-bottom fromLeft ">
            <p className="form-label inverseFontColor">Priority</p>
          </div>
          <div className="two-buttons">
            <p className="amoutOfpriority inverseFontColor02 ">{priority}%</p>
            <input
              type="range"
              min="0"
              max="100"
              value={priority}
              className="input-field "
              onChange={(e) => setPriority(Number(e.target.value))}
            />
          </div>
        </label>

        <div className="form-half-separator-up vertical-align-bottom">&nbsp;</div>

        <div className="two-buttons">
          {!toogleAddOrEdit && 
             <button
              className="button-secondary inverseButton"
              onClick={() => {
                if (confirm("Do you really want to delete this item?")) {
                // user click "OK"
               startActionToBackend("delete")
              }}}
            >
              Delete
            </button>
          }
          <button
            className="button-secondary inverseButton"
            onClick={cancelNewItemDialog}
          >
            Cancel
          </button>

          <button
            className="button-primary button-inner-space-left-right"
            onClick={(toogleAddOrEdit) ? () => startActionToBackend("add") : () => startActionToBackend("edit")}
          >
            {(toogleAddOrEdit) ? 
              <div className="in-button">
                <img className="button-icone" src="/icons/cross.svg" alt="add new item" />
                Create
                <div className="button-icone">&nbsp;</div>
              </div> : 
              "Update"
            }
          </button>
        </div>
      </div>
    </div>
  )
}
