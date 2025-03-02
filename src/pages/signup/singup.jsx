import React from "react"
import "./signup.css"

export default function SignupPage() {
  const handleSignup = (e) => {
    e.preventDefault()
    // Handle signup logic here
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
              <input id="companyName" type="text" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="companyEmail">Company Email</label>
              <input id="companyEmail" type="email" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Create Password</label>
              <input id="password" type="password" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Company Contact Number</label>
              <input id="contactNumber" type="tel" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="taxId">Tax Identification Number</label>
              <input id="taxId" type="text" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="businessPan">Business PAN</label>
              <input id="businessPan" type="text" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="businessId">Registered Business ID</label>
              <input id="businessId" type="text" required className="form-input" />
            </div>

            <button type="submit" className="signup-submit">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
