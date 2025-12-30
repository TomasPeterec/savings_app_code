"use client"

import "@/styles/SavingDetails.css"
import { useState } from "react"
import {  SavingData } from "@/app/dashboard/page"

interface NewItemProps {
  setToogleEditSaving?: (value: boolean) => void,
  savingData: SavingData | null;   
}

export default function EditSaving({
  savingData,
  setToogleEditSaving
}: NewItemProps) {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
 
  const fff = () => {}

  const closeEditSaving = () => {
    console.log("Closing edit saving")
    setToogleEditSaving && setToogleEditSaving(false)
  }

  return (
    <div className="saving-details-box s-d-b-new">
      <h3 className="main-savings-details-heading inverseFontColor">
        Edit: {savingData?.selectedSaving || "Loading..."}  
      </h3>
      <div className="form-card form-card-n-i">
        <div className="form-half-separator-down separatorTuning01"></div>
        <div className="form-half-separator-down separatorTuning01">
          <div className="visualSeparator"></div>
        </div>
        <div className="colapsable">
          <div className="colapsableSideSpace">
            
          </div>

          {/* --- START OF OPENED FORM --- */}
          <div className={
            "colapsableCenterOpen" }
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
                  value={"0"}
                  onChange={fff}
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
                  0000-00
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
                value={"0"}
                onChange={fff}
                className="input-field"
              />
              <div className="form-half-separator-down"></div>
            </label>
          </div>
          {/* --- END OF OPENED FORM --- */}

          {/* --- START OF COLLAPSED FORM --- */}
          <div className={
            "colapsableCenterClosed" }
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
                <p className="amoutColapsed inverseFontColor02">{"fgvfg"}</p>
                <div className="form-half-separator-down separatorLow"></div>
              </div>

              <div>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow paddingPlus">
                  <p className="form-label inverseFontColor">End date</p>
                </div>
                <p className="amoutColapsed inverseFontColor02 paddingPlus">
                  hvfhvgf
                </p>
              </div>
            </div>

            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label inverseFontColor">Link to the item</p>
            </div>
            <p className="amoutColapsed inverseFontColor02">{
              "Link to the item was not set"}
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

        <div className="form-half-separator-up vertical-align-bottom">&nbsp;</div>

        <div className="two-buttons">
    
          <button
            type="button"
            className="button-secondary inverseButton"
            onClick={closeEditSaving}
          >
            Cancel
          </button>


          <button
            className="button-primary button-inner-space-left-right"
            onClick={fff}
          >
            {
              "Update"
            }
          </button>
        </div>
      </div>
    </div>
  )
}
