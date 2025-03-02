import React from "react"
import "./User.css"

export default function OurUsers() {
  const users = [
    { name: "Flipkart", colorClass: "flipkart" },
    { name: "Amazon", colorClass: "amazon" },
    { name: "Meta", colorClass: "meta" },
    { name: "Google", colorClass: "google" },
    { name: "Facebook", colorClass: "facebook" },
  ]

  return (
    <section className="users-section">
      <div className="users-container">
        <h2 className="users-title">Our Users</h2>

        <div className="users-grid">
          {users.map((user, index) => (
            <div key={index} className="user-circle">
              <span className={`user-text ${user.colorClass}`}>{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
