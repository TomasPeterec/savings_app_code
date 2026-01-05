"use client"

import "@/styles/SavingDetails.css" 
import { useState,useEffect } from "react"
import { SavingData } from "@/app/dashboard/page"

interface NewItemProps {
  setToogleEditSaving?: (value: boolean) => void,
  savingData: SavingData | null;   
}

interface Email {
  id: string | null
  email: string | null
  editor: boolean
  forDeleting: boolean
}




export default function EditSaving({
  savingData,
  setToogleEditSaving
}: NewItemProps) {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  //const [totalSaved, setTotalSaved] = useState<number>(0)
  const [monthlyDeposited, setMonthlyDeposited] = useState<number>(0)
  const [nextCounting, setNextCounting] = useState<number>(0)
  const [toggle, setToggle] = useState<boolean>(true)
  const [listOfEmails, setListOfEmails] = useState<Email[]>([])
  const [newEmail, setNewEmail] = useState<string>("")

  const toggleColapse = () => {
    setToggle(!toggle)
  }

  const fff = () => {}

  const closeEditSaving = () => {
    setToogleEditSaving && setToogleEditSaving(false)
  }

  useEffect(() => {
    if (savingData) {   
      setName(savingData.selectedSaving || "")
      setDescription(savingData.description || "")
      //setTotalSaved(savingData.totalSaved || 0)
      setMonthlyDeposited(savingData.monthlyDeposited || 0)
      setNextCounting(savingData.countingDate || 0)

      const emails: Email[] = (savingData.signedAllowedUsers?.map(user => ({
        id: user.userId,
        email: user.email,
        editor: user.editor,
        forDeleting: false,
      })) ?? [])

      setListOfEmails(emails)
    }
  }, [savingData])

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
                <p className="form-label inverseFontColor">Saving name</p>
              </div>
              <input
                type="text"
                placeholder="Name"
                value={savingData?.selectedSaving || name }
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
                  <p className="form-label inverseFontColor">Monthly saved:</p>
                </div>
                <input
                  type="number"
                  value={monthlyDeposited}
                  onChange={(e) => setMonthlyDeposited(Number(e.target.value))}
                  placeholder="0"
                  className="input-field halfOfRow"
                />
                <div className="form-half-separator-down"></div>
              </label>

              <label>
                <div className="form-half-separator-up vertical-align-bottom halfOfRow">
                  <p className="form-label inverseFontColor">Counting date:</p>
                </div>
                <input
                  type="number"
                  value={nextCounting}
                  onChange={(e) => setNextCounting(Number(e.target.value))}
                  placeholder="0"
                  className="input-field halfOfRow"
                />
                <div className="form-half-separator-down"></div>
              </label>
            </div>
          </div>
          {/* --- END OF OPENED FORM --- */}

          {/* --- START OF COLLAPSED FORM --- */}
          <div className={!toggle ? 
            "colapsableCenterOpen" : 
            "colapsableCenterClosed"}
          >
            <div className="form-half-separator-up vertical-align-bottom">
              <p className="form-label inverseFontColor">Saving name</p>
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
            <button
              className="button-secondary colapseButton "
              onClick={toggleColapse}
            >
              <img
                className="chevron-icone"
                src={`/icons/${!toggle ? 
                  'ChevronWideDarkBlueDown' : 
                  'ChevronWideDarkBlueRight'}.svg`
                }
                alt="colaps decolaps"
              />
            </button>
          </div>  

          {/* --- START OF COLAPSABLE EMAIL FORM --- */}
          <div className={
            "colapsableCenterOpen" }
          >
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
              <div className={!toggle ? 
                "colapsableCenterOpen" : 
                "colapsableCenterClosed"}
              >
                <div className="inverseFontColor02">
                  {listOfEmails.map((email, index) => (
                    <div className="mail-row-nest" key={email.id}>
                      <div className="mail-row-visual-separator"></div>
                      <div className="mail-row" >
                        <p className="mail-row-text">{email.email}</p>
                        <div className="mail-row-buttons">
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
                            <span className="checkbox-style">
                              {email.forDeleting && <img
                                className="x-icone"
                                src={`/icons/checker.svg`}
                                alt="colaps decolaps"
                              />}
                            </span>
                          </label>
                          <button className="button-nested-small">
                            <img
                              className="x-icone"
                              src={`/icons/deleteIcone.svg`}
                              alt="colaps decolaps"
                            />
                          </button>
                        </div> 
                      </div>
                    </div>
                  ))}
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
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input-field"
                />
                <button className="button-nested">
                  <img
                    className="plus-icone"
                    src={`/icons/cross.svg`
                    }
                    alt="colaps decolaps"
                  />
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
              className="button-secondary inverseButton"
              onClick={() => {
                if (confirm("Do you really want to delete this saving?")) {

              }}}
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
