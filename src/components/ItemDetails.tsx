"use client"

import React from "react"
import "@/styles/SavingDetails.css"

interface ItemData {
  itemId: string
  itemName: string | null
  link: string | null
  price: number | null
  endDate: string | null  // alebo Date, ak konvertuješ z ISO
  saved: number | null
  priority: number | null
}

interface ItemDetailsProps {
  item: ItemData
  monthlyDeposited?: number | null
}


export default function ItemDetails({ item, monthlyDeposited }: ItemDetailsProps) {

  return (
    <>
      <div className="saving-details-box" >
        <div className="upper-row">
          <div className="savings-details-left">
            <div className="text-box">
              <h4 className="saving-details-heading">
                {item.itemName}
              </h4>
              <a
                className="savings-details-link"
                href={item.link ?? "#"} // zabezpečí, že link existuje, inak odkazuje na "#"
                target="_blank"        // otvorí v novom okne
                rel="noopener noreferrer" // bezpečnostná odporúčaná prax
              >
                <img
                  className="link-icone"
                  src="/icons/link.svg"
                  alt="change"
                />&nbsp;
                {item.link
                  ? item.link.length > 36
                    ? item.link.slice(0, 33) + "..."
                    : item.link
                  : ""}
              </a>
            </div>
          </div>
          <div className="main-savings-details-right">
            <button className="button-secondary smal-button">
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
            <div className="property-label-2">
              Item price:
            </div>
            <div className="property-value-2">
              {item.price} €
            </div>
          </div>
          <div className="property-box-2">
            <div className="property-label-2">
             End date:
            </div>
            <div className="property-value-2">
              {item.endDate && (() => {
                const date = new Date(item.endDate)
                const month = date.toLocaleString("en-US", { month: "short" }) // "May"
                const year = date.getFullYear() // 2026
                return (
                  <>
                    {month}<br/>
                    {year}
                  </>
                )
              })()}
            </div>
          </div>
          <div className="property-box-2">
            <div className="property-label-2">
              Saved<br/>so far:
            </div>
            <div className="property-value-2">
              {item.saved} €<br/>
              ({Math.round((item.saved ?? 0) / (item.price ?? 0) * 10000)/100}%)
            </div>
          </div>
          <div className="property-box-2">
            <div className="property-label-2">
              Priority monthly:
            </div>
            <div className="property-value-2">
              {Math.round(((monthlyDeposited ?? 0) * (item.priority ?? 0)) / 100)} €
              <br/>
              ({(item.priority ?? 0).toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>
    </>
  )
}