"use client"

import "@/styles/SavingDetails.css"
import { useState, useEffect, useCallback } from "react";
import { ItemData } from "@/app/dashboard/page" // adjust path if needed


interface NewItemProps {
  setNewItemVisible: (visible: boolean) => void
  writeData: () => void
  setNewItemToArr: (item: ItemData) => void
}


export default function NewItem({ setNewItemVisible, writeData, setNewItemToArr }: NewItemProps) {

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [desiredSum, setDesiredSum] = useState<number>(0)
  const [itemLink, setItemLink] = useState<string>("")
  const [priority, setPriority] = useState<number>(50)

  // starts sending new data to backend
  const writeNevItem = () => {
    writeData()
    setNewItemVisible(false)
  }
  
  const addNewItemToArray = useCallback((value: number) => {
    setPriority(value);
    setNewItemToArr({
      itemId: "",
      itemName: name,
      link: itemLink,
      price: desiredSum,
      saved: 0,
      endDate: "",
      priority: value
    });
  }, [name, itemLink, desiredSum, setNewItemToArr]);


  // start
  useEffect(() => {
    addNewItemToArray(50);
  }, [addNewItemToArray]);


  return (
    <div className="saving-details-box s-d-b-new">
      <h3 className="main-savings-details-heading">
          Create new item
      </h3>
      <div className="form-card form-card-n-i">
        <div className="form-half-separator-down">
            &nbsp;
        </div>
        <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Name</p>
          </div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(String(e.target.value))}
            className={`input-field`}
          />
          <div className="form-half-separator-down">
            {/* {emailError && <p className="field-message">{emailError}</p>} */}
          </div>
        </label>
              <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Short description</p>
          </div>
          <input
            type="text"
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(String(e.target.value))}
            className={`input-field`}
          />
          <div className="form-half-separator-down">
            {/* {emailError && <p className="field-message">{emailError}</p>} */}
          </div>
        </label>
        <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Desired sum</p>
          </div>
          <input
            type="number"
            placeholder="Desired sum"
            value={desiredSum}
            onChange={(e) => setDesiredSum(Number(e.target.value))}
            className={`input-field`}
          />
          <div className="form-half-separator-down">
            {/* {emailError && <p className="field-message">{emailError}</p>} */}
          </div>
        </label>
        <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Link to the item being saved for</p>
          </div>
          <input
            type="text"
            placeholder="Link to the item"
            value={itemLink}
            onChange={(e) => setItemLink(String(e.target.value))}
            className={`input-field`}
          />
          <div className="form-half-separator-down">
            {/* {emailError && <p className="field-message">{emailError}</p>} */}
          </div>
        </label>
        <label>
          <div className="form-half-separator-up vertical-align-bottom">
            <p className="form-label">Priority</p>
          </div>
          <div className="two-buttons">
            <p>
              {priority}%
            </p>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={50}
              className="input-field"
              onChange={(e) => addNewItemToArray(Number(e.target.value))}
            />
          </div>
        </label>
        <div className="form-half-separator-up vertical-align-bottom">
            &nbsp;
        </div>
        <div className="two-buttons">
          <button
            className="button-secondary"
            onClick={() => setNewItemVisible(false)}
          >
            Cancel
          </button>
          <button
            className="button-primary button-inner-space-left-right"
            onClick={() => writeNevItem()}
          >
            <div className="in-button">
              <img className="button-icone" src="/icons/cross.svg" alt="add new item" />
                Create
              <div className="button-icone" >&nbsp;</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
