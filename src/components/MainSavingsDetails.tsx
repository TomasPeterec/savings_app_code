"use client"

import React from "react"
import "@/styles/MainSavingsDetails.css"

interface AllowedUser {
  userId: string
  editor: boolean
}

interface SavingData {
  selectedSaving: string | null
  description: string | null
  totalSaved: number | null
  monthlyDeposited: number | null
  nextCounting: any | null
  currency: string | null
  signedAllowedUsers: AllowedUser[] | null
}

interface MainSavingsDetailsProps {
  savingData: SavingData | null;
}

export default function MainSavingsDetails({ savingData }: MainSavingsDetailsProps) {


  return (
    <>
      <div className="top-indentation">
        &nbsp;&nbsp;&nbsp;
      </div>
      <div className="main-savings-details-box" >
        <div className="main-savings-details-left">
          <div className="text-box">
            <div className="users-box">
              {savingData?.signedAllowedUsers?.map((item, index) => (
                <li key={index} className="user-smal">{item.userId}</li>
              ))}
            </div>
            <h3 className="main-savings-details-heading">
              {savingData?.selectedSaving ?? "No saving selected"}
            </h3>
            <p className="main-savings-details-description">
              {savingData?.description ?? "No description"}
            </p>
          </div>
          <div className="properties-box">
            <div className="property-box">
              <div className="property-label">
                Monthly deposited:
              </div>
              <div className="property-value">
                {savingData?.monthlyDeposited
                  ? `${savingData.monthlyDeposited} ${savingData.currency}`
                  : "No value"
                }
              </div>
            </div>
            <div className="property-box">
              <div className="property-label">
                Total&nbsp;<br/>saved:
              </div>
              <div className="property-value">
                {savingData?.totalSaved
                  ? `${savingData.totalSaved} ${savingData.currency}`
                  : "No value"
                }
              </div>
            </div>
            <div className="property-box">
              <div className="property-label">
                Next counting:
              </div>
              <div className="property-value">
                {savingData?.nextCounting
                  ? new Date(savingData.nextCounting).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short' // Jan, Feb, Mar...
                    })
                  : "No date"}
              </div>
            </div>
          </div>
        </div>
        <div className="main-savings-details-right">
          <button className="button-secondary smal-button">
            <img
              className="button-icone"
              src="/icons/change.svg"
              alt="change"
            />
          </button>
          <button className="button-secondary smal-button">
            <img
              className="button-icone"
              src="/icons/edit.svg"
              alt="change"
            />
          </button>
          <button className="button-primary smal-button">
            <img
              className="button-icone"
              src="/icons/cross.svg"
              alt="change"
            />
          </button>
        </div>
      </div>
    </>

  )
}