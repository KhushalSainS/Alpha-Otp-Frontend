import React, { useState, useEffect } from "react"
import { Shield } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import OopsPopup from "../oops/oops"
import "./Navbar.css"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showOopsPopup, setShowOopsPopup] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if user is logged in on component mount and route changes
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    // Remove token from both storage options
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/')
  }

  const handleGetAlphaOTP = (e) => {
    e.preventDefault()
    setShowOopsPopup(true)
  }

  const closeOopsPopup = () => {
    setShowOopsPopup(false)
  }

  const scrollToSection = (sectionId) => {
    closeMenu() // Close mobile menu if open
    
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
    let element = document.getElementById(sectionId)
    
    // If footer not found by ID, try to find the footer element
    if (!element && sectionId === 'footer') {
      element = document.querySelector('footer')
    }
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Shield className="navbar-logo-icon" fill="#f472b6" />
            <span className="navbar-logo-text">AlphaOTP</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="navbar-desktop">
            <Link to="/" className="navbar-link navbar-link-active">
              Home
            </Link>
            <a href="#" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
              About
            </a>
            <a href="#" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>
              Pricing
            </a>
            <a href="#" className="navbar-link" onClick={(e) => { e.preventDefault(); scrollToSection('footer'); }}>
              Contact
            </a>
          </nav>

          {/* Desktop Login/Logout Button */}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="navbar-login-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="navbar-login-button">
              Login
            </Link>
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="navbar-hamburger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`hamburger-line line-top ${
                isMenuOpen ? "line-top-open" : ""
              }`}
            />
            <span
              className={`hamburger-line line-middle ${
                isMenuOpen ? "line-middle-open" : ""
              }`}
            />
            <span
              className={`hamburger-line line-bottom ${
                isMenuOpen ? "line-bottom-open" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar-mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" className="mobile-menu-link" onClick={closeMenu}>
            Home
          </Link>
          <a href="#" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            About
          </a>
          <a href="#" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>
            Pricing
          </a>
          <a href="#" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('footer'); }}>
            Contact
          </a>
          
          {/* Mobile Login/Logout Button */}
          {isLoggedIn ? (
            <button
              className="mobile-menu-button"
              onClick={() => {
                closeMenu()
                handleLogout()
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="mobile-menu-button"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Oops Popup */}
      <OopsPopup isOpen={showOopsPopup} onClose={closeOopsPopup} />
    </>
  )
}
