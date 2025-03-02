import React from "react"
import "./about-us.css"

export default function AboutUs() {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-title">ABOUT ALPHAOTP</h2>

        <div className="about-content-box">
          <div className="about-text-block">
            <p>
              OTP scams are skyrocketing, with scammers exploiting numerical OTPs across banking and non-banking
              sectors. At AOTP, we've engineered a groundbreaking solution: Alphabetical OTPs (AOTP)—a cryptographically
              secure, alphabet-based OTP system exclusively for non-banking use cases like e-commerce, app logins, and
              tech support.
            </p>

            <p>
              Powered by HOTP and TOTP algorithms, AOTP leverages cryptographically secure random generation, encrypted
              storage, and real-time verification to deliver unmatched security. By distinguishing non-banking OTPs from
              banking ones, AOTP empowers users to spot and stop scams instantly.
            </p>

            <p>
              Our AOTP API seamlessly integrates into existing systems, offering businesses a robust, scalable, and
              user-friendly authentication layer. With features like JWT-based encryption, bcrypt hashing, and instant
              OTP destruction, AOTP ensures end-to-end security while eliminating fraud.
            </p>

            <p>
              Join the AOTP revolution and redefine digital security. Secure. Scalable. Scam-Proof.
            </p>
          </div>

          <div className="about-subtitle">
            <h3>AOTP: Where Innovation Meets Protection</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
