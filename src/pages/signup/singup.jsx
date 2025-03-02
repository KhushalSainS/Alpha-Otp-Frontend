import React, { useState, useContext } from "react"
import axios from "axios"
import { StoreContext } from "../../context/StoreContext"
import "./signup.css"

export default function SignupPage() {
  const { url, setToken } = useContext(StoreContext)
  const [showOops, setShowOops] = useState(false)
  
  // Form state
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("")
  const [businessPan, setBusinessPan] = useState("")
  const [registeredBusinessId, setRegisteredBusinessId] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    
    try {
      const response = await axios.post(`${url}/api/user/register`, {
        companyName,
        email,
        password,
        contactNumber,
        taxIdentificationNumber,
        businessPan,
        registeredBusinessId
      });
      
      if (response.data && response.data.token) {
        // Store the token and handle successful signup
        setToken(response.data.token)
        // Redirect or update UI as needed
        window.location.href = "/"; // Example redirect
      } else {
        setShowOops(true)
      }
    } catch (error) {
      console.error("Signup failed:", error)
      setShowOops(true)
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-box">
          {/* Logo & Title */}
          <div className="signup-header">
            <div className="logo-circle">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="logo-svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="logo-text">Alphaotp</span>
          </div>

          <h1 className="signup-title">Sign up</h1>

          {/* Form */}
          <form onSubmit={handleSignup} className="signup-form">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input 
                id="companyName" 
                type="text" 
                required 
                className="form-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Company Email</label>
              <input 
                id="email" 
                type="email" 
                required 
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Create Password</label>
              <input 
                id="password" 
                type="password" 
                required 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Company Contact Number</label>
              <input 
                id="contactNumber" 
                type="tel" 
                required 
                className="form-input"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="taxIdentificationNumber">Tax Identification Number</label>
              <input 
                id="taxIdentificationNumber" 
                type="text" 
                required 
                className="form-input"
                value={taxIdentificationNumber}
                onChange={(e) => setTaxIdentificationNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="businessPan">Business PAN</label>
              <input 
                id="businessPan" 
                type="text" 
                required 
                className="form-input"
                value={businessPan}
                onChange={(e) => setBusinessPan(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="registeredBusinessId">Registered Business ID</label>
              <input 
                id="registeredBusinessId" 
                type="text" 
                required 
                className="form-input"
                value={registeredBusinessId}
                onChange={(e) => setRegisteredBusinessId(e.target.value)}
              />
            </div>

            <button type="submit" className="signup-submit">
              Sign up
            </button>
          </form>
        </div>
      </div>
      
      {showOops && (
        <div className="error-popup">
          <div className="error-content">
            <h3>Oops! Something went wrong</h3>
            <p>Please check your information and try again.</p>
            <button onClick={() => setShowOops(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  )
}
