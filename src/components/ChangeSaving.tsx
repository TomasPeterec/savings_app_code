"use client"

import React from "react"
import "@/styles/SavingDetails.css"
import { auth } from "@/firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"

type ChangeSavingProps = {
  setToggleChangeSaving: (value: boolean) => void
}

const ChangeSaving = ({ setToggleChangeSaving }: ChangeSavingProps) => {
  const fff = () => {
    console.log("Something")
  }

  const cancelBottomsheet = () => {
    setToggleChangeSaving(false)
  }

  return (
    <>
      <div className="saving-details-box s-d-b-new">
        <h3 className="main-savings-details-heading inverseFontColor">Edit:</h3>
        <div className="two-buttons">
          <button
            className="button-secondary inverseButton"
            onClick={() => {
              if (confirm("Do you really want to delete this saving?")) {
              }
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="button-secondary inverseButton"
            onClick={() => cancelBottomsheet()}
          >
            Cancel
          </button>
          <button className="button-primary button-inner-space-left-right" onClick={() => fff()}>
            {"Update"}
          </button>
        </div>
      </div>
    </>
  )
}

export default ChangeSaving
