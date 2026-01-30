"use client"

import React from "react"
import "@/styles/SavingDetails.css"
import { auth } from "@/firebase/firebase"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { SavingData } from "@/app/dashboard/page"
import { ItemData } from "@/app/dashboard/page"

type ChangeSavingProps = {
  setCountOfSavings: (value: number) => void
  setEditor: (value: boolean) => void
  setToggleChangeSaving: (value: boolean) => void
  setSavingData: React.Dispatch<React.SetStateAction<SavingData | null>>
  setItemsData: React.Dispatch<React.SetStateAction<ItemData[]>>
  setItemsDataCopy: React.Dispatch<React.SetStateAction<ItemData[]>>
  setItemsDataCopy2: React.Dispatch<React.SetStateAction<ItemData[]>>
}

type SavingItem = {
  uuid: string
  name: string
  shortName: string
}

const ChangeSaving = ({
  setToggleChangeSaving,
  setSavingData,
  setItemsData,
  setItemsDataCopy,
  setItemsDataCopy2,
  setCountOfSavings,
  setEditor,
}: ChangeSavingProps) => {
  const [toggle, setToggle] = useState<boolean>(true)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [nextCounting, setNextCounting] = useState<number>(0)
  const [listOfSavings, setListOfSavings] = useState<SavingItem[]>([])
  const [loadingNow, setLoadingNow] = useState<boolean>(false)

  useEffect(() => {
    setLoadingNow(true)
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) {
        setListOfSavings([])
        return
      }

      const idToken = await currentUser.getIdToken()

      try {
        const res = await fetch("/api/savings/access", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const data: SavingItem[] = await res.json()

        setListOfSavings(data)
        setLoadingNow(false)
      } catch (err) {
        console.error("Backend error:", err)
      }
    })
    return () => unsubscribe()
  }, [])

  const fff = () => {
    console.log("Something")
  }

  const cancelBottomsheet = () => {
    setToggleChangeSaving(false)
  }

  const loadChosen = async (savingObject: SavingItem) => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error("No user is signed in.")
      return
    }

    try {
      const idToken = await currentUser.getIdToken()

      const res = await fetch("/api/savings/selected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uuid: savingObject.uuid,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Backend returned error:", text)
        return
      }

      const data = await res.json()

      // In ChangeSaving.tsx → loadChosen
      if (data) {
        setSavingData(data.changeSaving)
        setItemsData(data.changeItems)
        setItemsDataCopy(data.changeItems)
        setItemsDataCopy2(data.changeItems)
        setCountOfSavings(data.countOfSavings)
        setEditor(data.editor)
        cancelBottomsheet()
      }
    } catch (err) {
      console.error("Error sending new item:", err)
    }
  }

  return (
    <div className="saving-details-box s-d-b-new">
      <h3 className="main-savings-details-heading inverseFontColor">Choose other saving</h3>
      <div className="form-card form-card-n-i">
        <div className="form-half-separator-down separatorTuning01"></div>
        {/* --- START OF COLLAPSED FORM --- */}
        <div className="form-half-separator-down separatorTuning01">
          <div className="visualSeparator"></div>
        </div>
        <div className="colapsable">
          <div className="colapsableSideSpace">
            <button
              data-testid="chevron-toggle"
              className="button-secondary colapseButton "
              onClick={() => setToggle(!toggle)}
            >
              <img
                className="chevron-icone"
                src={`/icons/${
                  !toggle ? "ChevronWideDarkBlueDown" : "ChevronWideDarkBlueRight"
                }.svg`}
                alt="colaps decolaps"
              />
            </button>
          </div>
          {/* --- START OF COLAPSABLE saving FORM --- */}
          <div className={"colapsableCenterOpen"}>
            <label>
              <div className="vertical-align-bottom width-inner horizontal-rule">
                <div className="slim-row">
                  <p className="form-label inverseFontColor">Already created savings</p>
                </div>
                <div className="slim-row">
                  <p className="form-label inverseFontColor">{toggle ? "Owner" : ""}</p>
                </div>
              </div>
              {/* --- START OF COLAPSABLE LIST OF savingS --- */}
              <div className={toggle ? "colapsableCenterOpen" : "colapsableCenterClosed"}>
                {loadingNow ? (
                  <p className="inverseFontColor02">Loading data...</p>
                ) : (
                  <div className="inverseFontColor02">
                    {listOfSavings.map((saving, index) => (
                      <div
                        onClick={() => loadChosen(saving)}
                        className="mail-row-nest"
                        key={saving.uuid}
                      >
                        <div className="mail-row-visual-separator"></div>
                        <div className="mail-row">
                          <p className="mail-row-text">{saving.name}</p>
                          <div className="users-box">
                            <li key={index} className="user-smal-bright">
                              {saving.shortName}
                            </li>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mail-row-visual-separator"></div>
                    <div className="separator-from-butons"></div>
                  </div>
                )}
              </div>
              {/* --- END OF COLAPSABLE LIST OF savingS --- */}

              <div className="imput-plus-nest"></div>

              <div className="form-half-separator-down"></div>
            </label>
          </div>
          {/* --- END OF COLAPSABLE saving FORM --- */}
          <div className="colapsableSideSpace"></div>
        </div>

        <div className="form-half-separator-down separatorTuning01">
          <div className="visualSeparator"></div>
        </div>

        <div className="colapsable">
          <div className="colapsableSideSpace">
            <button className="button-secondary colapseButton" onClick={() => setToggle(!toggle)}>
              <img
                className="chevron-icone"
                src={`/icons/${
                  toggle ? "ChevronWideDarkBlueDown" : "ChevronWideDarkBlueRight"
                }.svg`}
                alt="colaps decolaps"
              />
            </button>
          </div>
          {/* --- START OF EXPANDABLE FORM --- */}
          <div data-testid="saving-form-collapsable" className={"colapsableCenterOpen"}>
            <label>
              <div className="form-half-separator-up vertical-align-bottom">
                <p className="form-label inverseFontColor">Saving name</p>
              </div>
              <div className="imput-plus-nest">
                <input
                  type="text"
                  placeholder="Enter saving address"
                  value={""}
                  onChange={e => e.target.value}
                  className={`input-field widthSeparate ${!toggle ? "moreLong" : ""}`}
                />
                <button
                  onClick={() => {}}
                  className={`button-nested ${!toggle ? "disAppearance" : ""}`}
                >
                  <img className="plus-icone" src={`/icons/cross.svg`} alt="colaps decolaps" />
                </button>
              </div>
              <div className="form-half-separator-down"></div>
            </label>

            {/* --- START OF COLAPSABLE PART --- */}

            <div className={!toggle ? "colapsableCenterOpen" : "colapsableCenterClosed"}>
              <label>
                <div className="form-half-separator-up vertical-align-bottom">
                  <p className="form-label inverseFontColor">Short description</p>
                </div>
                <input
                  type="text"
                  placeholder="Short description"
                  value={""}
                  onChange={e => e.target.value}
                  className="input-field"
                />
                <div className="form-half-separator-down"></div>
              </label>

              {/* --- DOUBLE ROW --- */}
              <div className="twoInRow">
                <label>
                  <div className="form-half-separator-up vertical-align-bottom halfOfRow">
                    <p className="form-label inverseFontColor">Monthly saved:</p>
                  </div>
                  <input
                    type="number"
                    value={""}
                    onChange={e => e.target.value}
                    placeholder="0"
                    className="input-field halfOfRow"
                  />
                  <div className="form-half-separator-down"></div>
                </label>
                <label>
                  <div className="form-half-separator-up vertical-align-bottom halfOfRow">
                    <p className="form-label inverseFontColor">Counting day:</p>
                  </div>
                  <div style={{ position: "relative" }}>
                    {/* Input-like field that opens the dropdown */}
                    <input
                      type="text"
                      readOnly
                      value={nextCounting || ""}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      placeholder="Select day"
                      className="input-field halfOfRow"
                      style={{ cursor: "pointer" }}
                    />

                    {/* Dropdown with values 1–28 */}
                    {dropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          maxHeight: 150,
                          overflowY: "auto",
                          border: "1px solid #ccc",
                          background: "#fff",
                          zIndex: 1000,
                        }}
                      >
                        {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                          <div
                            key={day}
                            onClick={() => {
                              setNextCounting(day)
                              setDropdownOpen(false)
                            }}
                            style={{
                              padding: "6px 10px",
                              cursor: "pointer",
                              backgroundColor: day === nextCounting ? "#eee" : "#fff",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#eee")}
                            onMouseLeave={e =>
                              (e.currentTarget.style.backgroundColor =
                                day === nextCounting ? "#eee" : "#fff")
                            }
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-half-separator-down"></div>
                </label>
              </div>
            </div>

            {/* --- END OF COLAPSABLE PART --- */}
          </div>
          {/* --- END OF EXPANDABLE FORM --- */}

          <div className="colapsableSideSpace"></div>
        </div>

        {/* --- END OF COLLAPSED FORM --- */}

        {/* BUTON PART */}
        <div className="form-half-separator-up vertical-align-bottom">&nbsp;</div>
        <div className="two-buttons">
          <button
            type="button"
            className="button-secondary inverseButton"
            onClick={() => cancelBottomsheet()}
          >
            Cancel
          </button>
          <button
            className={toggle ? "disAppearance" : "button-primary button-inner-space-left-right"}
            onClick={() => fff()}
          >
            {"Update"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeSaving
