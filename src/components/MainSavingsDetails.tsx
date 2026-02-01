"use client"

import React from "react"
import "@/styles/MainSavingsDetails.css"

interface AllowedUser {
  shortName: string
  userId: string
  editor: boolean
  email: string | null
}

interface SavingData {
  uuid: string | null
  selectedSaving: string | null
  description: string | null
  totalSaved: number | null
  monthlyDeposited: number | null
  countingDate: number | null
  currency: string | null
  signedAllowedUsers: AllowedUser[] | null
}

interface MainSavingsDetailsProps {
  editor: boolean | null
  owner: boolean | null
  setToggleChangeSaving: (value: boolean) => void
  setToggleEditSaving?: (value: boolean) => void
  setToggleAddOrEdit: (value: boolean) => void
  savingData: SavingData | null
  setNewItemVisible: (visible: boolean) => void
}

export default function MainSavingsDetails({
  editor,
  owner,
  setToggleChangeSaving,
  setToggleEditSaving,
  savingData,
  setToggleAddOrEdit,
  setNewItemVisible,
}: MainSavingsDetailsProps) {
  const openBottomSheet = () => {
    setNewItemVisible(true)
    setToggleAddOrEdit(true)
  }

  const openBottomSheetForEdit = () => {
    setToggleEditSaving && setToggleEditSaving(true)
  }

  const getNextCountingDate = (dayOfMonth: number | null) => {
    if (!dayOfMonth) return "No date"

    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    // Create a date for the current month
    let nextDate = new Date(year, month, dayOfMonth)

    // If the day has already passed this month, use the next month
    if (nextDate < today) {
      nextDate = new Date(year, month + 1, dayOfMonth)
    }

    // Format the date as day and month only
    return nextDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    })
  }

  const toggleChangeSavingOn = () => {
    setToggleChangeSaving(true)
  }

  return (
    <>
      <div className="top-indentation">&nbsp;&nbsp;&nbsp;</div>

      <div className="main-savings-details-box">
        <div className="main-savings-details-left">
          <div className="text-box">
            <div className="users-box">
              {savingData?.signedAllowedUsers?.map((item, index) => (
                <li key={index} className="user-smal">
                  {item.shortName}
                </li>
              ))}
            </div>

            <h3 className="main-savings-details-heading">
              {savingData?.selectedSaving ?? "Loading..."}
            </h3>

            <p className="main-savings-details-description">
              {savingData?.description ?? "Wait for data..."}
            </p>
          </div>

          <div className="properties-box">
            <div className="property-box">
              <div className="property-label">Monthly deposited:</div>
              <div className="property-value">
                {savingData?.monthlyDeposited
                  ? `${savingData.monthlyDeposited} ${savingData.currency}`
                  : "No value"}
              </div>
            </div>

            <div className="property-box">
              <div className="property-label">
                Total&nbsp;
                <br />
                saved:
              </div>
              <div className="property-value">
                {savingData?.totalSaved
                  ? `${Math.floor(savingData.totalSaved)} ${savingData.currency}`
                  : "No value"}
              </div>
            </div>

            <div className="property-box">
              <div className="property-label">Next counting:</div>
              <div className="property-value">
                {getNextCountingDate(savingData?.countingDate ?? null)}
              </div>
            </div>
          </div>
        </div>

        <div className="main-savings-details-right">
          <button className="button-secondary smal-button" onClick={() => toggleChangeSavingOn()}>
            <img className="button-icone" src="/icons/change.svg" alt="change" />
          </button>

          <button
            disabled={!owner ? true : false}
            className="button-secondary smal-button"
            onClick={() => openBottomSheetForEdit()}
          >
            <img
              className={`button-icone ${owner ? "" : "disabled-icone"}`}
              src="/icons/edit.svg"
              alt="edit"
            />
          </button>

          <button
            disabled={!editor ? true : false}
            className={`smal-button ${editor ? "button-primary" : "smal-button-primary-muted"}`}
            onClick={() => openBottomSheet()}
          >
            <img className={`button-icone`} src="/icons/cross.svg" alt="add new item" />
          </button>
        </div>
      </div>
    </>
  )
}
