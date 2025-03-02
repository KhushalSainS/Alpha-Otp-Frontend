import React from "react"
import { X } from "lucide-react"
import "./oops.css"

export default function OopsPopup({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="oops-overlay">
      <div className="oops-popup">
        <button onClick={onClose} className="oops-close">
          <X size={24} />
        </button>

        <div className="oops-content">
          <div className="oops-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="icon-svg"
            >
              <path
                d="M12 9V14M12 17.5V17.6M6.6 19.5H17.4C18.8 19.5 19.5 18.8 19.5 17.4V6.6C19.5 5.2 18.8 4.5 17.4 4.5H6.6C5.2 4.5 4.5 5.2 4.5 6.6V17.4C4.5 18.8 5.2 19.5 6.6 19.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="oops-title">Oops!</h2>
          <p className="oops-text">You need to create an account to use AlphaOTP</p>

          <div className="oops-info-box">
            <p className="oops-info">
              AlphaOTP provides enhanced security for your applications. To get started, please sign up for an account.
            </p>
          </div>

          <div className="oops-buttons">
            <a href="/signup" className="oops-button main-button">
              Sign Up
            </a>
            <a href="/login" className="oops-button outline-button">
              I already have an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
