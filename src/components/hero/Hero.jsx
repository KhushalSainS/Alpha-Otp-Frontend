import React, { useState, useContext } from "react"
import { Check } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import OopsPopup from "../oops/oops"
import { StoreContext } from "../../context/StoreContext"
import "./Hero.css"

export default function Hero() {
  const [showOopsPopup, setShowOopsPopup] = useState(false)
  const { token } = useContext(StoreContext)
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/')
      // Need to use setTimeout to allow for navigation to complete
      setTimeout(() => {
        scrollToElementById(sectionId)
      }, 100)
    } else {
      // We're already on home page, just scroll
      scrollToElementById(sectionId)
    }
  }
  
  // Helper function to find and scroll to elements
  const scrollToElementById = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleGetAlphaOTP = (e) => {
    e.preventDefault()
    
    if (token) {
      // Scroll to pricing section if user has token
      scrollToSection('pricing')
    } else {
      // Show OopsPopup if no token
      setShowOopsPopup(true)
    }
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
