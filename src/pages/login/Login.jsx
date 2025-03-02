import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import OopsPopup from "../../components/oops/oops";
import { StoreContext } from "../../context/StoreContext";
import "./Login.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showOops, setShowOops] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${url}/api/user/login`, {
        email,
        password
      });
      
      if (response.data && response.data.token) {
        // Store the token and handle successful login
        setToken(response.data.token)
        window.location.href = "/";
        // You could redirect the user here or update the UI
      } else {
        setShowOops(true)
      }
    } catch (error) {
      console.error("Login failed:", error)
      setShowOops(true)
    }
  };

  return (
    <main className="login-page">
      <div className="login-box">
        {/* Header */}
        <div className="login-box-header">
          <div className="logo-container">
            <div className="logo-circle">
              <img
                src="/placeholder.svg?height=24&width=24"
                alt="AlphaOTP Logo"
                className="logo-image"
              />
            </div>
            <span className="logo-text">AlphaOTP</span>
          </div>
          <button className="close-button" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h1 className="login-title">Log In</h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Company Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@company.com"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="form-input password-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-submit">
            Log in
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="signup-link">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {showOops && <OopsPopup onClose={() => setShowOops(false)} />}
    </main>
  );
}
