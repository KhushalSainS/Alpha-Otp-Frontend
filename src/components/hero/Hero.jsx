import React, { useState } from "react"
import { Check } from "lucide-react"
import OopsPopup from "../oops/oops"
import "./Hero.css"

export default function Hero() {
  const [showOopsPopup, setShowOopsPopup] = useState(false)

  const handleGetAlphaOTP = (e) => {
    e.preventDefault()
    setShowOopsPopup(true)
  }

  const closeOopsPopup = () => {
    setShowOopsPopup(false)
  }

  return (
    <section className="hero-section">
      {/* Background "OTP" text */}
      <div className="hero-otp-bg">
        <span className="hero-otp-text">OTP</span>
      </div>

      <div className="hero-container">
        <div className="hero-content-row">
          {/* Left Content */}
          <div className="hero-left">
            <h1 className="hero-title">Generate Your AlphaOTP</h1>
            <p className="hero-subtitle">
              AlphaOTP provides you with a one-time password consisting of letters (A-Z,a-z) increasing security by
              protecting your services from various threats.
            </p>
            <div>
              <a href="#" className="hero-button" onClick={handleGetAlphaOTP}>
                Get AlphaOTP
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="hero-right">
            <div className="hero-blue-card">
              <h2 className="blue-card-title">We Provide:</h2>
              <ul className="blue-card-list">
                {[
                  "AlphaOTP Generation",
                  "AlphaOTP Storage",
                  "AlphaOTP transmission",
                  "Threat detection",
                  "User management",
                ].map((item, index) => (
                  <li key={index} className="blue-card-item">
                    <Check className="blue-card-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Verification code card - moved below the blue card */}
            <div className="hero-verification-wrapper">
              <div className="hero-verification-card">
                <p className="verification-title">Verification code</p>
                <div className="verification-codes">
                  {["G", "E", "F", "K", "A", "I"].map((letter, index) => (
                    <div key={index} className="verification-code-box">
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Oops Popup */}
      <OopsPopup isOpen={showOopsPopup} onClose={closeOopsPopup} />
    </section>
  )
}
