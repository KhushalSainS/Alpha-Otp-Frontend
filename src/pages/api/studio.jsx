import React, { useState, useEffect } from "react"
import { Trash2, Copy, X, Eye, EyeOff } from "lucide-react"
import "./studio.css"

/* --------------------------
   Mock API Service
-------------------------- */
let mockApiKeys = []

async function fetchApiKeys() {
  // In a real app, you'd call your backend or database
  return mockApiKeys
}

async function createApiKey({ name, email, password }) {
  // In a real app, you'd call your backend or database
  const id = Math.random().toString(36).substring(2, 15)
  const value = `ey.Jhb6c1Oi.JTIlzT1NiIsInR5cCT4IkpXVC.J9.eyJhc2V5TIjoiZTkyZDUG${id}`

  const newApiKey = {
    id,
    name,
    value,
    createdAt: new Date().toISOString(),
  }
  mockApiKeys.push(newApiKey)
  return value
}

async function deleteApiKey(id) {
  // In a real app, you'd call your backend or database
  mockApiKeys = mockApiKeys.filter((key) => key.id !== id)
}

/* --------------------------
   CreateApiKeyModal
-------------------------- */
function CreateApiKeyModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = "API Name is required"
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }
    if (!password.trim()) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const apiKey = await createApiKey({ name, email, password })
      onSuccess(apiKey)
      resetForm()
    } catch (error) {
      console.error("Failed to create API key:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={handleClose}>
          <X size={24} />
        </button>

        <h3 className="modal-title">Create API Key</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name */}
          <div className="form-group">
            <label>API Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`form-input ${errors.name ? "error-border" : ""}`}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email for sending OTP</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? "error-border" : ""}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Email Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input password-input ${errors.password ? "error-border" : ""}`}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* --------------------------
   StoreApiKeyModal
-------------------------- */
function StoreApiKeyModal({ isOpen, onClose, apiKey }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !apiKey) return null

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h3 className="modal-title">Store your API key</h3>

        <p className="modal-paragraph">
          Use the following API key to connect to your project. This token will only be accessible this time; make sure
          to store it before closing this view.
        </p>

        <div className="api-key-box">
          <div className="api-key-text">{apiKey}</div>
          <button className="api-key-copy" onClick={copyToClipboard}>
            {copied ? "Copied!" : <Copy size={16} />}
          </button>
        </div>

        <div className="modal-footer">
          <button className="btn-outline">View documentation</button>
          <button className="btn-success" onClick={onClose}>
            I've stored it securely
          </button>
        </div>
      </div>
    </div>
  )
}

/* --------------------------
   DeleteApiKeyModal
-------------------------- */
function DeleteApiKeyModal({ isOpen, onClose, apiKey, onConfirm }) {
  const [confirmation, setConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !apiKey) return null

  const handleDelete = async () => {
    if (confirmation !== apiKey.name) return
    setIsDeleting(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error("Error deleting API key:", error)
    } finally {
      setIsDeleting(false)
      setConfirmation("")
    }
  }

  const handleClose = () => {
    setConfirmation("")
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={handleClose}>
          <X size={24} />
        </button>
        <h3 className="modal-title">Delete API Key</h3>
        <p className="modal-paragraph">
          You are about to delete the <strong>{apiKey.name}</strong> API key. Any application using this API key will no
          longer be able to authenticate requests.
        </p>
        <p className="modal-paragraph">
          To confirm, please type <strong>"{apiKey.name}"</strong> in the box below:
        </p>
        <input
          placeholder="Type to confirm"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="form-input"
        />

        <div className="modal-actions-right">
          <button className="btn-outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={confirmation !== apiKey.name || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* --------------------------
   Main Page (Studio Page)
-------------------------- */
export default function StudioPage() {
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState(null)
  const [selectedApiKey, setSelectedApiKey] = useState(null)

  // Load API Keys on mount
  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    setIsLoading(true)
    try {
      const keys = await fetchApiKeys()
      setApiKeys(keys)
    } catch (error) {
      console.error("Failed to load API keys:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSuccess = (apiKeyValue) => {
    setNewApiKey(apiKeyValue)
    setIsCreateModalOpen(false)
    setIsStoreModalOpen(true)
    loadApiKeys()
  }

  const handleStoreModalClose = () => {
    setIsStoreModalOpen(false)
    setNewApiKey(null)
  }

  const handleDeleteClick = (apiKey) => {
    setSelectedApiKey(apiKey)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedApiKey) return
    try {
      await deleteApiKey(selectedApiKey.id)
      setApiKeys(apiKeys.filter((key) => key.id !== selectedApiKey.id))
      setIsDeleteModalOpen(false)
      setSelectedApiKey(null)
    } catch (error) {
      console.error("Failed to delete API key:", error)
    }
  }

  return (
    <div className="studio-page">
      {/* Top Header */}
      <header className="studio-header">
        <div className="header-container">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header-icon"
          >
            <path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-3a5 5 0 110-10 5 5 0 010 10z"
              fill="currentColor"
            />
          </svg>
          <h1 className="header-title">AlphaOTP Studio</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="studio-main">
        <div className="studio-card">
          <div className="studio-card-header">
            <div>
              <h2 className="card-title">API Keys</h2>
              <p className="card-description">Manage API keys for your environment</p>
            </div>
            <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              Create API Key
            </button>
          </div>

          <div className="studio-card-content">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="no-keys-box">
                <h3 className="no-keys-title">API Keys</h3>
                <p className="no-keys-text">Your environment does not have any api keys</p>
                <p className="no-keys-text">Create one to get started</p>
                <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                  Create API Key
                </button>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                      <th>Created at</th>
                      <th className="th-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((apiKey) => (
                      <tr key={apiKey.id}>
                        <td>{apiKey.name}</td>
                        <td>
                          {"*".repeat(12)}
                          {apiKey.value.substring(apiKey.value.length - 4)}
                        </td>
                        <td>{new Date(apiKey.createdAt).toLocaleString()}</td>
                        <td className="td-action">
                          <button
                            className="btn-ghost-icon"
                            onClick={() => handleDeleteClick(apiKey)}
                            aria-label={`Delete API key ${apiKey.name}`}
                          >
                            <Trash2 className="trash-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Create Key Modal */}
        <CreateApiKeyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        {/* Store Key Modal */}
        <StoreApiKeyModal
          isOpen={isStoreModalOpen}
          onClose={handleStoreModalClose}
          apiKey={newApiKey}
        />

        {/* Delete Key Modal */}
        <DeleteApiKeyModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          apiKey={selectedApiKey}
          onConfirm={handleDeleteConfirm}
        />
      </main>
    </div>
  )
}
