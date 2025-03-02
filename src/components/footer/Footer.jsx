import React, { useState, useEffect } from "react"
import { Mail, MapPin, Phone, Linkedin, Facebook, Twitter, CheckCircle } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import "./Footer.css"

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  // Check if user is logged in on component mount and route changes
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setIsLoggedIn(false)
    // No need to navigate as the page will refresh or redirect automatically
  }
  
  return (
    <footer className="site-footer" id="footer">
      {/* CTA Section */}
      <div className="footer-cta">
        <h2 className="footer-cta-title">Ready to secure your authentication?</h2>
        <p className="footer-cta-subtitle">
          Join thousands of businesses that trust AlphaOTP for their security needs.
        </p>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="footer-cta-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="footer-cta-button">
            Login
          </Link>
        )}
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Contact Information */}
            <div className="footer-column">
              <h3 className="footer-column-title">Contact Information</h3>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <Phone className="footer-contact-icon" />
                  <div>
                    <p>+919773926687, 8901791767</p>
                    <p className="footer-contact-subtext">24x7 Available</p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <Mail className="footer-contact-icon" />
                  <p>info@adelsocial.com</p>
                </div>
                <div className="footer-contact-item">
                  <MapPin className="footer-contact-icon" />
                  <p>
                    DLF Avenue, Saket,
                    <br />
                    New Delhi - 110017.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3 className="footer-column-title">Quick Links</h3>
              <ul className="footer-link-list">
                <li>
                  <a href="/about" className="footer-link">
                    About
                  </a>
                </li>
                <li>
                  <a href="/domain-hosting" className="footer-link">
                    Domain &amp; Hosting
                  </a>
                </li>
                <li>
                  <a href="/services" className="footer-link">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/contact" className="footer-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services Provided */}
            <div className="footer-column">
              <h3 className="footer-column-title">Services Provided</h3>
              <div className="footer-services-grid">
                <div className="footer-service-item">
                  <CheckCircle className="footer-service-icon" />
                  <span>SEO Services</span>
                </div>
                <div className="footer-service-item">
                  <CheckCircle className="footer-service-icon" />
                  <span>Pay-per-click</span>
                </div>
                <div className="footer-service-item">
                  <CheckCircle className="footer-service-icon" />
                  <span>Social Media</span>
                </div>
                <div className="footer-service-item">
                  <CheckCircle className="footer-service-icon" />
                  <span>Web Analytics</span>
                </div>
                <div className="footer-service-item">
                  <CheckCircle className="footer-service-icon" />
                  <span>Web Development</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-social-icons">
              <a
                href="https://linkedin.com"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="footer-social-icon" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://facebook.com"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="footer-social-icon" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="footer-social-icon" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
            <div className="footer-copyright">
              © 2025 AlphaOTP. All Rights Reserved | Designed &amp; Developed By ADELSOCIAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
