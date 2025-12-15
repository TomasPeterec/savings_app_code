"use client"

import "@/styles/SavingDetails.css"
import { useState, useEffect } from "react"
import { ItemData } from "@/app/dashboard/page"


interface NewItemProps {
  setNewItemVisible: (visible: boolean) => void
  setNewItemToSave: (item: ItemData) => void
  monthlyDeposited?: number | null
  sendNewItemToBackend: () => void
  calculateEndDate: (
    price: number,
    saved: number,
    monthlyDeposited: number,
    priority: number
  ) => string
}

export default function NewItem({
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
      itemId: "",
      itemName: name,
      link: itemLink,
      price: desiredSum,
      saved: 0,
      endDate: endDateforNew,
      priority: priority
    })
  }, [name, itemLink, desiredSum, endDateforNew, priority, setNewItemToSave])


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

  const writeNevItem = () => {
    sendNewItemToBackend()
    reset()
    setNewItemVisible(false)
  }

  const cancelNewItemDialog = () => {
    reset()
    setNewItemVisible(false)
  }


  return (
    <div className="saving-details-box s-d-b-new">
      <h3 className="main-savings-details-heading">
        Create new item
      </h3>

      <div className="form-card form-card-n-i">
        <div className="form-half-separator-down">&nbsp;</div>

        <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Name</p>
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
            <p className="form-label">Short description</p>
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
              <p className="form-label">Desired sum</p>
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
              <p className="form-label">End date</p>
            </div>
            <div className="halfOfRow endDate paddingPlus">
              {endDateforNew && (() => {
                const date = new Date(endDateforNew)
                const month = date.toLocaleString("en-US", { month: "short" })
                const year = date.getFullYear()
                return <>{month}&nbsp;{year}</>
              })()}
            </div>
          </label>
        </div>

        {/* ----------------------------- */}
        <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Link to the item</p>
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

        <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Priority</p>
          </div>
          <div className="two-buttons">
            <p className="amoutOfpriority">{priority}%</p>
            <input
              type="range"
              min="0"
              max="100"
              value={priority}
              className="input-field"
              onChange={(e) => setPriority(Number(e.target.value))}
            />
          </div>
        </label>

        <div className="form-half-separator-up vertical-align-bottom">&nbsp;</div>

        <div className="two-buttons">
          <button
            className="button-secondary"
            onClick={cancelNewItemDialog}
          >
            Cancel
          </button>

          <button
            className="button-primary button-inner-space-left-right"
            onClick={writeNevItem}
          >
            <div className="in-button">
              <img className="button-icone" src="/icons/cross.svg" alt="add new item" />
              Create
              <div className="button-icone">&nbsp;</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
