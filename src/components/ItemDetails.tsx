"use client"

import React from "react"
import "@/styles/SavingDetails.css"

interface ItemData {
  itemId: string
  itemName: string | null
  link: string | null
  price: number | null
  endDate: string | null
  saved: number | null
  priority: number | null
  locked: boolean | null
}

interface ItemDetailsProps {
  removeItemTemporarily?: (itemId: string) => void
  setNewItemToSave: (value: ItemData) => void
  setToogleAddOrEdit: (value: boolean) => void
  setNewItemVisible: (visible: boolean) => void
  item: ItemData
  monthlyDeposited?: number | null
}

export default function ItemDetails({
  removeItemTemporarily,
  setNewItemToSave,
  item,
  monthlyDeposited,
  setToogleAddOrEdit,
  setNewItemVisible,
}: ItemDetailsProps) {

  const openBotomSheet = () => {
    if (typeof setNewItemToSave !== "function") {
      console.error(
        "setNewItemToSave is not a function",
        setNewItemToSave
      )
      return
    }
    setNewItemToSave(item)
    removeItemTemporarily && removeItemTemporarily(item.itemId)
    setNewItemVisible(true)
    setToogleAddOrEdit(false)
  }

  return (
    <div className="saving-details-box">
      <div className="upper-row">
        <div className="savings-details-left">
          <div className="text-box">
            <h4 className="saving-details-heading">
              {item.itemName}
            </h4>

            <a
              className="savings-details-link"
              href={item.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="link-icone"
                src="/icons/link.svg"
                alt="change"
              />
              &nbsp;
              {item.link
                ? item.link.length > 36
                  ? item.link.slice(0, 27) + "..."
                  : item.link
                : ""}
            </a>
          </div>
        </div>

        <div className="main-savings-details-right">
          <button
            className="button-secondary smal-button"
            onClick={openBotomSheet}
          >
            <img
              className="button-icone"
              src="/icons/edit.svg"
              alt="change"
            />
          </button>
        </div>
      </div>

      <div className="properties-box-2">
        <div className="property-box-2">
          <div className="property-label-2">Item price:</div>
          <div className="property-value-2">{item.price} €</div>
        </div>

        <div className="property-box-2">
          <div className="property-label-2">End date:</div>
          <div className="property-value-2">
            {item.endDate && (() => {
              const date = new Date(item.endDate)
              return (
                <>
                  {date.toLocaleString("en-US", { month: "short" })}
                  <br />
                  {date.getFullYear()}
                </>
              )
            })()}
          </div>
        </div>

        <div className="property-box-2">
          <div className="property-label-2">
            Saved<br />so far:
          </div>
          <div className="property-value-2">
            {item.saved} €
            <br />
            ({Math.round((item.saved ?? 0) / (item.price ?? 1) * 10000) / 100}%)
          </div>
        </div>

        <div className="property-box-2">
          <div className="property-label-2">Priority monthly:</div>
          <div className="property-value-2">
            {Math.round(((monthlyDeposited ?? 0) * (item.priority ?? 0)) / 100)} €
            <br />
            ({(item.priority ?? 0).toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  )
}
