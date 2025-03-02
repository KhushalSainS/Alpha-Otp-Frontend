import React, { useState } from "react";
import {
  Check,
  AlertTriangle,
  Lock,
  Key,
  Users,
  PhoneCall,
  Zap,
  Rocket,
  Settings,
  X
} from "lucide-react";
import OopsPopup from "../oops/oops";
import "./pricing.css";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const isLoggedIn = false;

  const handleSelectPlan = (plan) => {
    if (!isLoggedIn) {
      setShowPopup(true);
    } else {
      setSelectedPlan(plan);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <h2 className="pricing-title">Pricing</h2>
        <p className="pricing-subtitle">Choose the plan that fits your needs</p>

        <div className="pricing-table-wrapper">
          <table className="pricing-table">
            <thead>
              <tr className="table-head">
                <th className="head-features">Features</th>
                <th className="head-tier basic-tier">
                  <div className="tier-heading">
                    <span>Starter (Basic)</span>
                    <Settings className="tier-icon" size={24} />
                  </div>
                </th>
                <th className="head-tier highlighted-tier">
                  <div className="popular-badge">Most Popular</div>
                  <div className="tier-heading">
                    <span>Pro (Power User)</span>
                    <Zap className="tier-icon tier-icon-pro" size={24} />
                  </div>
                </th>
                <th className="head-tier enterprise-tier">
                  <div className="tier-heading">
                    <span>Enterprise (Business Growth)</span>
                    <Rocket className="tier-icon tier-icon-enterprise" size={24} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Price Row */}
              <tr className="row-bg-1">
                <td className="table-cell features-cell">
                  <Lock className="cell-icon lock-icon" size={20} />
                  <span>Price</span>
                </td>
                <td className="table-cell text-center">₹999/month</td>
                <td className="table-cell text-center highlighted-cell">₹2,999/month</td>
                <td className="table-cell text-center">₹7,999/month</td>
              </tr>

              {/* OTP Generation */}
              <tr className="row-bg-2">
                <td className="table-cell features-cell">
                  <Key className="cell-icon key-icon" size={20} />
                  <span>OTP Generation</span>
                </td>
                <td className="table-cell text-center">5,000 OTPs/month</td>
                <td className="table-cell text-center highlighted-cell">50,000 OTPs/month</td>
                <td className="table-cell text-center">2,00,000 OTPs/month</td>
              </tr>

              {/* MFA Row */}
              <tr className="row-bg-1">
                <td className="table-cell features-cell">
                  <div className="cell-icon custom-icon">
                    {/* custom svg */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <span>Multi-Factor Authentication (MFA)</span>
                </td>
                <td className="table-cell text-center">
                  <div className="inline-flex">
                    <Check className="check-icon" size={20} />
                    <span className="ml-1">SMS OTP</span>
                  </div>
                </td>
                <td className="table-cell text-center highlighted-cell">
                  <div className="inline-flex">
                    <Check className="check-icon" size={20} />
                    <span className="ml-1">SMS + Email OTP</span>
                  </div>
                </td>
                <td className="table-cell text-center">
                  <div className="inline-flex">
                    <Check className="check-icon" size={20} />
                    <span className="ml-1">SMS + Email + Authenticator App</span>
                  </div>
                </td>
              </tr>

              {/* User Accounts */}
              <tr className="row-bg-2">
                <td className="table-cell features-cell">
                  <Users className="cell-icon user-icon" size={20} />
                  <span>User Accounts</span>
                </td>
                <td className="table-cell text-center">Up to 10 Users</td>
                <td className="table-cell text-center highlighted-cell">Up to 100 Users</td>
                <td className="table-cell text-center">Up to 500 Users</td>
              </tr>

              {/* Customer Support */}
              <tr className="row-bg-1">
                <td className="table-cell features-cell">
                  <PhoneCall className="cell-icon phone-icon" size={20} />
                  <span>Customer Support</span>
                </td>
                <td className="table-cell text-center">Email Support</td>
                <td className="table-cell text-center highlighted-cell">Priority Support</td>
                <td className="table-cell text-center">24/7 Dedicated Account Manager</td>
              </tr>

              {/* Auto-Renewal */}
              <tr className="row-bg-2">
                <td className="table-cell features-cell">
                  <AlertTriangle className="cell-icon alert-icon" size={20} />
                  <span>Auto-Renewal</span>
                </td>
                <td className="table-cell text-center">
                  <div className="inline-flex">
                    <Check className="check-icon" size={20} />
                    <span className="ml-1">Optional</span>
                  </div>
                </td>
                <td className="table-cell text-center highlighted-cell">
                  <div className="inline-flex">
                    <Check className="check-icon" size={20} />
                    <span className="ml-1">Optional</span>
                  </div>
                </td>
                <td className="table-cell text-center">
                  <div className="inline-flex">
                    <Check className="check-icon" size={20} />
                    <span className="ml-1">Optional with Custom Terms</span>
                  </div>
                </td>
              </tr>
              
              {/* Select Plan Button Row */}
              <tr className="row-bg-1">
                <td className="table-cell features-cell">
                  <span>Select Your Plan</span>
                </td>
                <td className="table-cell text-center">
                  <button 
                    className={`plan-button basic-button ${selectedPlan === 'basic' ? 'selected-plan' : ''}`}
                    onClick={() => handleSelectPlan('basic')}
                  >
                    Select Starter
                  </button>
                </td>
                <td className="table-cell text-center highlighted-cell">
                  <button 
                    className={`plan-button pro-button ${selectedPlan === 'pro' ? 'selected-plan' : ''}`}
                    onClick={() => handleSelectPlan('pro')}
                  >
                    Select Pro
                  </button>
                </td>
                <td className="table-cell text-center">
                  <button 
                    className={`plan-button enterprise-button ${selectedPlan === 'enterprise' ? 'selected-plan' : ''}`}
                    onClick={() => handleSelectPlan('enterprise')}
                  >
                    Select Enterprise
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <h3 className="modal-title">Plan Selected</h3>
            <p className="modal-message">
              You've selected the <span className="selected-plan-name">
                {selectedPlan === 'basic' && 'Starter'}
                {selectedPlan === 'pro' && 'Pro'}
                {selectedPlan === 'enterprise' && 'Enterprise'}
              </span> plan!
            </p>
            <p>Our team will contact you shortly to complete the setup.</p>
            <button className="modal-button" onClick={closeModal}>
              Got it!
            </button>
          </div>
        </div>
      )}

      <OopsPopup 
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </section>
  )
}
