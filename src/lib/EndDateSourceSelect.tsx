"use client"

import "@/styles/SavingDetails.css"
import { useState } from "react"

export type EndDateSource = "Current monthly saved value" | "12 month average" | "12 month median"

interface Props {
  value: EndDateSource | ""
  onChange: (value: EndDateSource) => void
}

export default function EndDateSourceSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const options: EndDateSource[] = [
    "Current monthly saved value",
    "12 month average",
    "12 month median",
  ]

  return (
    <label>
      <div className="form-half-separator-up vertical-align-bottom">
        <p className="form-label inverseFontColor">End date estimated from:</p>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          readOnly
          value={value}
          placeholder="Select source"
          onClick={() => setOpen(o => !o)}
          className="input-field"
          style={{ cursor: "pointer" }}
        />

        {open && (
          <div className="dropdown-menu">
            {options.map(option => (
              <div
                key={option}
                className={`day-item ${option === value ? "selected" : ""}`}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-half-separator-down"></div>
    </label>
  )
}
