"use client"

import "@/styles/SavingDetails.css"
import { useState, useEffect } from "react"
import { SavingData } from "@/app/dashboard/page"
import type { Auth } from "firebase/auth"

interface EditSavingProps {
  countOfSavings?: number
  editor?: boolean
  auth: Auth
  setToggleEditSaving?: (value: boolean) => void
  savingData: SavingData | null
  mainUserId: string | null
  updateParentSavingData?: (updated: SavingData) => void
}

interface Email {
  id: string | null
  email: string | null
  editor: boolean
  forDeleting: boolean
}

export default function EditSaving({
  countOfSavings,
  editor,
  updateParentSavingData,
  auth,
  mainUserId,
  savingData,
  setToggleEditSaving,
}: EditSavingProps) {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [totalSaved, setTotalSaved] = useState<number>(0)
  const [monthlyDeposited, setMonthlyDeposited] = useState<number>(0)
  const [nextCounting, setNextCounting] = useState<number>(0)
  const [toggle, setToggle] = useState<boolean>(true)
  const [listOfEmails, setListOfEmails] = useState<Email[]>([])
  const [newEmail, setNewEmail] = useState<string>("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleColapse = () => {
    setToggle(!toggle)
  }

  const closeEditSaving = () => {
    setToggleEditSaving && setToggleEditSaving(false)
  }

  useEffect(() => {
    if (savingData) {
      setName(savingData.selectedSaving || "")
      setDescription(savingData.description || "")
      setTotalSaved(savingData.totalSaved || 0)
      setMonthlyDeposited(savingData.monthlyDeposited || 0)
      setNextCounting(savingData.countingDate || 0)

      const emails: Email[] =
        savingData.signedAllowedUsers?.map(user => ({
          id: user.userId,
          email: user.email,
          editor: user.editor,
          forDeleting: false,
        })) ?? []

      setListOfEmails(emails)
    }
  }, [savingData])

  const addNewEmail = async () => {
    let runRest = true

    listOfEmails.map(item => {
      if (newEmail === item.email) {
        alert(`The email is allready in the list or it is owners email`)
        runRest = false
      }
    })

    if (runRest === true) {
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error("No user is signed in.")
        return
      }

      try {
        const idToken = await currentUser.getIdToken()

        const resAboutEmail = await fetch("/api/emails/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            email: newEmail,
          }),
        })

        const data = await resAboutEmail.json()

        if (data.userEmail === newEmail) {
          setListOfEmails([
            ...listOfEmails,
            {
              id: data.userId,
              email: data.userEmail,
              editor: false,
              forDeleting: false,
            },
          ])
        } else {
          alert("There is no user of DreamSaver app with this email address")
        }
      } catch (err) {
        console.error("Error get info about emails", err)
      }
    }

    setToggle(false)
    setNewEmail("")
  }

  const sendUpdate = async () => {
    const cuttedList = listOfEmails.filter(email => email.id !== mainUserId)
    const sendSaving = {
      nextCounting,
      monthlyDeposited,
      name,
      uuid: savingData?.uuid,
      curency: savingData?.currency,
      totalSaved: totalSaved,
      description,
    }

    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error("No user is signed in")
      return
    }

    try {
      const idToken = await currentUser.getIdToken()

      const rest = await fetch("/api/savings/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          sendSaving,
          cuttedList,
        }),
      })

      const data = await rest.json()

      if (data.updatedSaving) {
        updateParentSavingData &&
          updateParentSavingData({
            uuid: data.updatedSaving.uuid,
            selectedSaving: data.updatedSaving.name, // <-- mapovanie názvu
            description: data.updatedSaving.description,
            totalSaved: data.updatedSaving.totalSaved,
            monthlyDeposited: data.updatedSaving.monthlyDeposited,
            countingDate: data.updatedSaving.countingDate, // <-- mapovanie counting date
            currency: data.updatedSaving.currency,
            signedAllowedUsers: data.allowedUsers, // <-- zoznam používateľov
          })
      }
    } catch (err) {
      console.error("Error save saving settings", err)
    }

    closeEditSaving()
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
            <button className="button-secondary colapseButton" onClick={toggleColapse}>
              <img
                className="chevron-icone"
                src={`/icons/${
                  toggle ? "ChevronWideDarkBlueDown" : "ChevronWideDarkBlueRight"
                }.svg`}
                alt="colaps decolaps"
              />
            </button>
          </div>
          {/* --- START OF OPENED FORM --- */}
          <div className={toggle ? "colapsableCenterOpen" : "colapsableCenterClosed"}>
            <label>
              <div className="form-half-separator-up vertical-align-bottom">
                <p className="form-label inverseFontColor">Saving name</p>
              </div>
              <input
                type="text"
                placeholder="Name"
                value={savingData?.selectedSaving || name}
                onChange={e => setName(e.target.value)}
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
                onChange={e => setDescription(e.target.value)}
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
                  value={monthlyDeposited}
                  onChange={e => setMonthlyDeposited(Number(e.target.value))}
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
          {/* --- END OF OPENED FORM --- */}

          {/* --- START OF COLLAPSED FORM --- */}
          <div className={!toggle ? "colapsableCenterOpen" : "colapsableCenterClosed"}>
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label inverseFontColor">Saving name</p>
            </div>
            <p className="amoutColapsed inverseFontColor02">{name || "Name is not set"}</p>
            <div className="form-half-separator-down separatorLow"></div>

            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label inverseFontColor">Short description</p>
            </div>
            <p className="amoutColapsed inverseFontColor02">
              {description || "Short description is not set"}
            </p>
            <div className="form-half-separator-down separatorLow"></div>

            {/* --- DOUBLE ROW --- */}
            <div className="twoInRow">
              <div>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow">
                  <p className="form-label inverseFontColor">Monthly saved:</p>
                </div>
                <p className="amoutColapsed inverseFontColor02">{monthlyDeposited}</p>
                <div className="form-half-separator-down separatorLow"></div>
              </div>

              <div>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow paddingPlus">
                  <p className="form-label inverseFontColor">Counting date:</p>
                </div>
                <p className="amoutColapsed inverseFontColor02 paddingPlus">{nextCounting}</p>
                <div className="form-half-separator-down separatorLow"></div>
              </div>
            </div>
          </div>
          {/* --- END OF COLLAPSED FORM --- */}
          <div className="colapsableSideSpace"></div>
        </div>

        {/* --- START OF COLLAPSED FORM --- */}
        <div className="form-half-separator-down separatorTuning01">
          <div className="visualSeparator"></div>
        </div>
        <div className="colapsable">
          <div className="colapsableSideSpace">
            <button className="button-secondary colapseButton " onClick={toggleColapse}>
              <img
                className="chevron-icone"
                src={`/icons/${
                  !toggle ? "ChevronWideDarkBlueDown" : "ChevronWideDarkBlueRight"
                }.svg`}
                alt="colaps decolaps"
              />
            </button>
          </div>
          {/* --- START OF COLAPSABLE EMAIL FORM --- */}
          <div className={"colapsableCenterOpen"}>
            <label>
              <div className="vertical-align-bottom width-inner horizontal-rule">
                <div className="slim-row">
                  <p className="form-label inverseFontColor">Shared with</p>
                </div>
                <div className="slim-row">
                  <p className="form-label inverseFontColor">{!toggle ? "Editor    Del." : ""}</p>
                </div>
              </div>
              {/* --- START OF COLAPSABLE LIST OF EMAILS --- */}
              <div className={!toggle ? "colapsableCenterOpen" : "colapsableCenterClosed"}>
                <div className="inverseFontColor02">
                  {listOfEmails.map(
                    (email, index) =>
                      email.id != mainUserId && (
                        <div className="mail-row-nest" key={email.id}>
                          <div className="mail-row-visual-separator"></div>
                          <div className="mail-row">
                            <p className="mail-row-text">{email.email}</p>
                            <div className="mail-row-buttons">
                              <label className="checkbox-wrapper">
                                <input
                                  type="checkbox"
                                  checked={email.editor}
                                  onChange={() => {
                                    setListOfEmails(prev =>
                                      prev.map((e, i) =>
                                        i === index ? { ...e, editor: !e.editor } : e
                                      )
                                    )
                                  }}
                                />
                                <span className="checkbox-style-line">
                                  <img
                                    className="x-icone"
                                    src={`/icons/${email.editor ? "checkedOn" : "checkedOff"}.svg`}
                                    alt="colaps decolaps"
                                  />
                                </span>
                              </label>
                              <label className="checkbox-wrapper">
                                <input
                                  type="checkbox"
                                  checked={email.forDeleting}
                                  onChange={() => {
                                    setListOfEmails(prev =>
                                      prev.map((e, i) =>
                                        i === index ? { ...e, forDeleting: !e.forDeleting } : e
                                      )
                                    )
                                  }}
                                />
                                <span className="checkbox-style-line">
                                  <img
                                    className="x-icone"
                                    src={`/icons/${email.forDeleting ? "deleteSmalOn" : "deleteSmalOff"}.svg`}
                                    alt="colaps decolaps"
                                  />
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                  <div className="mail-row-visual-separator"></div>
                  <div className="separator-from-butons"></div>
                </div>
              </div>
              {/* --- END OF COLAPSABLE LIST OF EMAILS --- */}
              <div className="imput-plus-nest">
                <input
                  type="text"
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="input-field"
                />
                <button
                  onClick={() => {
                    addNewEmail()
                  }}
                  className="button-nested"
                >
                  <img className="plus-icone" src={`/icons/cross.svg`} alt="colaps decolaps" />
                </button>
              </div>
              <div className="form-half-separator-down"></div>
            </label>
          </div>
          {/* --- END OF COLAPSABLE EMAIL FORM --- */}
          <div className="colapsableSideSpace"></div>
        </div>

        {/* BUTON PART */}
        <div className="form-half-separator-up vertical-align-bottom">&nbsp;</div>
        <div className="two-buttons">
          <button
            disabled={(countOfSavings && countOfSavings < 1) || !editor ? true : false}
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
            onClick={closeEditSaving}
          >
            Cancel
          </button>
          <button
            className="button-primary button-inner-space-left-right"
            onClick={() => sendUpdate()}
          >
            {"Update"}
          </button>
        </div>
      </div>
    </div>
  )
}
