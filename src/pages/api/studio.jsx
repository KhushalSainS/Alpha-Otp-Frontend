import React, { useState, useEffect, useContext } from "react"
import { Trash2, Copy, X, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { StoreContext } from "../../context/StoreContext"
import "./studio.css"

/* --------------------------
   API Service
-------------------------- */
async function fetchApiKeys(baseUrl, token) {
  try {
    const response = await fetch(`${baseUrl}/api/user/api-keys`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch API keys');
    }
    
    return data.apiKeys;
  } catch (error) {
    console.error("Error fetching API keys:", error);
    throw error;
  }
}

async function createApiKey(baseUrl, token, { name, email, password }) {
  try {
    const response = await fetch(`${baseUrl}/api/user/create-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,           // Add name to the request body
        email,
        emailPassword: password,
        emailService: "gmail" // Default service
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create API key');
    }
    
    // Store new key in local storage for retrieval
    if (data.apiKey) {
      try {
        // Get existing API keys or initialize empty array
        const storedApiKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
        
        // Add new API key with proper name and timestamp
        storedApiKeys.push({
          id: data.apiKey._id || data.apiKey.id,
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
          keyFragment: data.apiKey.key.substring(data.apiKey.key.length - 4)
        });
        
        // Store back to localStorage
        localStorage.setItem('apiKeys', JSON.stringify(storedApiKeys));
      } catch (storageError) {
        console.error("Failed to save API key to local storage:", storageError);
      }
    }
    
    return {
      apiKey: {
        ...data.apiKey,
        name: name // Ensure name is part of the returned API key object
      },
      apiEndpoints: data.apiEndpoints,
      gmailWarning: data.gmailWarning
    };
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }
}

async function deleteApiKey(baseUrl, token, id) {
  try {
    const response = await fetch(`${baseUrl}/api/user/api-key/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete API key');
    }
    
    return data;
  } catch (error) {
    console.error("Error deleting API key:", error);
    throw error;
  }
}

/* --------------------------
   Payment Verification
-------------------------- */
async function verifyPayment(paymentDetails) {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('http://localhost:5000/api/user/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
      },
      body: JSON.stringify({
        paymentId: paymentDetails.razorpay_payment_id,
        paymentLinkId: paymentDetails.razorpay_payment_link_id,
        referenceId: paymentDetails.razorpay_payment_link_reference_id,
        paymentStatus: paymentDetails.razorpay_payment_link_status,
        signature: paymentDetails.razorpay_signature
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { 
      success: false, 
      message: 'Failed to verify payment' 
    };
  }
}

/* --------------------------
   Payment Status Notification
-------------------------- */
function PaymentNotification({ status, message, onClose }) {
  if (!status) return null;
  
  const isSuccess = status === 'success';
  
  return (
    <div className={`payment-notification ${isSuccess ? 'success' : 'error'}`}>
      <div className="notification-icon">
        {isSuccess ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
      </div>
      <div className="notification-message">
        <h4>{isSuccess ? 'Payment Successful' : 'Payment Issue'}</h4>
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  );
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

  const { url, token } = useContext(StoreContext);

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
      const apiKeyData = await createApiKey(url, token, { name, email, password })
      onSuccess(apiKeyData)
      resetForm()
    } catch (error) {
      console.error("Failed to create API key:", error)
      setErrors({ ...errors, server: error.message })
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
   StoreApiKeyModal - Fix closing tag errors
-------------------------- */
function StoreApiKeyModal({ isOpen, onClose, apiKeyData }) {
  const [copied, setCopied] = useState(false)
  const [copyTab, setCopyTab] = useState('key') // 'key', 'baseUrl', 'send', 'verify'

  if (!isOpen || !apiKeyData) return null

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }
  
  // Get the appropriate text to copy based on selected tab
  const getCopyText = () => {
    switch(copyTab) {
      case 'key':
        return apiKeyData.apiKey.key;
      case 'baseUrl':
        return apiKeyData.apiEndpoints.baseUrl;
      case 'send':
        return apiKeyData.apiEndpoints.usage.send;
      case 'verify':
        return apiKeyData.apiEndpoints.usage.verify;
      default:
        return '';
    }
  }
  
  // Get a display label for the current tab
  const getTabLabel = () => {
    switch(copyTab) {
      case 'key':
        return 'API Key';
      case 'baseUrl':
        return 'Base URL';
      case 'send':
        return 'Send OTP Endpoint';
      case 'verify':
        return 'Verify OTP Endpoint';
      default:
        return '';
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content api-modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h3 className="modal-title">Your API Key Details</h3>

        <p className="modal-paragraph">
          Save these details securely. This is the only time you'll see the complete API key.
        </p>
        
        {apiKeyData.gmailWarning && (
          <div className="warning-message">
            <AlertCircle size={20} />
            <p>{apiKeyData.gmailWarning}</p>
          </div>
        )}
        
        <div className="api-tabs-container">
          <div className="api-tabs">
            <button 
              className={`api-tab ${copyTab === 'key' ? 'active' : ''}`}
              onClick={() => setCopyTab('key')}
            >
              API Key
            </button>
            <button 
              className={`api-tab ${copyTab === 'baseUrl' ? 'active' : ''}`}
              onClick={() => setCopyTab('baseUrl')}
            >
              Base URL
            </button>
            <button 
              className={`api-tab ${copyTab === 'send' ? 'active' : ''}`}
              onClick={() => setCopyTab('send')}
            >
              Send OTP
            </button>
            <button 
              className={`api-tab ${copyTab === 'verify' ? 'active' : ''}`}
              onClick={() => setCopyTab('verify')}
            >
              Verify OTP
            </button>
          </div>
        </div>
        
        <div className="endpoint-label">{getTabLabel()}</div>
        <div className="api-key-container">
          <div className="api-key-box">
            <div className="api-key-text">{getCopyText()}</div>
            <button 
              className="api-key-copy" 
              onClick={() => copyToClipboard(getCopyText())}
            >
              {copied ? <span>Copied!</span> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="endpoint-help">
          {copyTab === 'send' && (
            <p>Replace <code>{"{recipient}"}</code> with the email address where the OTP should be sent.</p>
          )}
          {copyTab === 'verify' && (
            <p>Replace <code>{"{recipient}"}</code> with the email address and <code>{"{otp}"}</code> with the OTP code to verify.</p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-outline">View documentation</button>
          <button className="btn-success" onClick={onClose}>
            I've stored it securely
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   DeleteApiKeyModal - Fix closing tag syntax
-------------------------- */
function DeleteApiKeyModal({ isOpen, onClose, apiKey, onConfirm }) {
  const [confirmation, setConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !apiKey) return null
  
  // Get the display name for the API key (use name first, then fallback to email)
  const apiKeyName = apiKey.name || apiKey.emailConfig?.email || apiKey.email || "this API key";

  const handleDelete = async () => {
    if (confirmation !== apiKeyName) return
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
        
        <div className="api-key-delete-info">
          <h4>API Key: <span className="highlight-name">{apiKeyName}</span></h4>
          {apiKey.emailConfig?.email && apiKey.emailConfig.email !== apiKeyName && (
            <p>Email: {apiKey.emailConfig.email}</p>
          )}
        </div>
        
        <p className="modal-paragraph">
          You are about to delete this API key. Any application using this API key will no
          longer be able to authenticate requests.
        </p>
        <p className="modal-paragraph">
          To confirm, please type <strong>"{apiKeyName}"</strong> in the box below:
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
            disabled={confirmation !== apiKeyName || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Main Page (Studio Page) - Enhance with local storage API key info
-------------------------- */
export default function StudioPage() {
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [newApiKeyData, setNewApiKeyData] = useState(null)
  const [selectedApiKey, setSelectedApiKey] = useState(null)
  const [paymentNotification, setPaymentNotification] = useState(null)
  const [error, setError] = useState(null)

  // Get URL and token from context
  const { url, token } = useContext(StoreContext)

  // Parse URL query parameters
  const getQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const params = {};
    
    // Convert query params to object
    for (const [key, value] of queryParams.entries()) {
      params[key] = value;
    }
    
    return params;
  };

  // Load API Keys on mount
  useEffect(() => {
    if (token) {
      loadApiKeys()
    }
  }, [token, url])
  
  // Check for payment redirect and handle status
  useEffect(() => {
    const handlePaymentRedirect = async () => {
      const params = getQueryParams();
      
      // First check for status from direct server callback
      if (params.status === 'success' && params.orderId) {
        setPaymentNotification({
          status: 'success',
          message: 'Your payment was successful! Credits have been added to your wallet.'
        });
        
        // Clean up the URL to remove query parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // If no direct server callback status, check for Razorpay params to verify client-side
      if (
        params.razorpay_payment_id &&
        params.razorpay_payment_link_id &&
        params.razorpay_payment_link_reference_id &&
        params.razorpay_signature
      ) {
        try {
          // Show loading notification
          setPaymentNotification({
            status: 'processing',
            message: 'Verifying your payment...'
          });
          
          // Verify the payment with backend
          const result = await verifyPayment(params);
          
          if (result.success) {
            // Payment verification successful
            setPaymentNotification({
              status: 'success',
              message: 'Your payment was successful! Credits have been added to your wallet.'
            });
          } else {
            // Payment verification failed
            setPaymentNotification({
              status: 'error',
              message: result.message || 'Payment verification failed. Please contact support.'
            });
          }
          
          // Clean up the URL to remove query parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Error handling payment redirect:', error);
          setPaymentNotification({
            status: 'error',
            message: 'Something went wrong while verifying your payment.'
          });
        }
      }
    };
    
    handlePaymentRedirect();
  }, []);

  // Load API Keys from server and enhance with local storage data
  const loadApiKeys = async () => {
    setIsLoading(true)
    setError(null)
    try {
      let keys = await fetchApiKeys(url, token)
      
      // Get locally stored API key information
      try {
        const localKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
        
        // Enhance server keys with locally stored names when possible
        keys = keys.map(serverKey => {
          const keyId = serverKey._id || serverKey.id;
          const keyFragment = serverKey.key?.substring(serverKey.key.length - 4);
          
          // Try to find matching key in local storage
          const localMatch = localKeys.find(localKey => 
            (localKey.id && localKey.id === keyId) || 
            (keyFragment && localKey.keyFragment === keyFragment)
          );
          
          // If we found a match, use the name from local storage
          if (localMatch && localMatch.name) {
            return {
              ...serverKey,
              name: localMatch.name // Override with locally stored name
            };
          }
          
          return serverKey;
        });
      } catch (localStoreError) {
        console.error("Failed to retrieve API keys from local storage:", localStoreError);
      }
      
      setApiKeys(keys)
    } catch (error) {
      console.error("Failed to load API keys:", error)
      setError("Failed to load API keys. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSuccess = (apiKeyData) => {
    setNewApiKeyData(apiKeyData)
    setIsCreateModalOpen(false)
    setIsStoreModalOpen(true)
    
    // Enhanced reload to ensure newly created key appears in the table
    setTimeout(() => {
      loadApiKeys() // Refresh API keys list
    }, 500) // Small delay to ensure backend has processed the creation
  }

  const handleStoreModalClose = () => {
    setIsStoreModalOpen(false)
    setNewApiKeyData(null)
  }

  // Improved handleDeleteClick with better debugging
  const handleDeleteClick = (apiKey) => {
    console.log("Deleting API key:", apiKey);
    setSelectedApiKey(apiKey);
    setIsDeleteModalOpen(true);
  }

  // Update handleDeleteConfirm to also remove from localStorage
  const handleDeleteConfirm = async () => {
    if (!selectedApiKey) return;
    
    try {
      // Log the deletion attempt
      console.log("Confirming deletion of:", selectedApiKey);
      
      // Get the ID in a more reliable way
      const apiKeyId = selectedApiKey._id || selectedApiKey.id;
      console.log("API Key ID for deletion:", apiKeyId);
      
      if (!apiKeyId) {
        console.error("No valid ID found for deletion");
        throw new Error("Invalid API key ID");
      }
      
      // Make the API call
      await deleteApiKey(url, token, apiKeyId);
      
      // Filter out the deleted key
      setApiKeys(apiKeys.filter((key) => {
        const keyId = key._id || key.id;
        return keyId !== apiKeyId;
      }));
      
      // Also remove from localStorage if it exists
      try {
        const keyFragment = selectedApiKey.key?.substring(selectedApiKey.key.length - 4);
        
        const storedApiKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
        const updatedKeys = storedApiKeys.filter(key => 
          (key.id !== apiKeyId) && (key.keyFragment !== keyFragment)
        );
        
        localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
      } catch (storageError) {
        console.error("Failed to update localStorage:", storageError);
      }
      
      setIsDeleteModalOpen(false);
      setSelectedApiKey(null);
    } catch (error) {
      console.error("Failed to delete API key:", error);
      alert("Error deleting API key: " + error.message);
    }
  }

  // Make the table more responsive on mobile
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

      {/* Payment Notification */}
      {paymentNotification && (
        <PaymentNotification 
          status={paymentNotification.status} 
          message={paymentNotification.message}
          onClose={() => setPaymentNotification(null)}
        />
      )}

      {/* Main Content */}
      <main className="studio-main">
        <div className="studio-card">
          <div className="studio-card-header">
            <div className="card-header-text">
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
            ) : error ? (
              <div className="error-message">
                <AlertCircle size={24} />
                <p>{error}</p>
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
              <div className="table-responsive-wrapper">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="hide-on-medium">Email</th>
                      <th className="hide-on-mobile">Value</th>
                      <th className="hide-on-mobile">Created</th>
                      <th className="th-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((apiKey) => {
                      // Ensure API key has all required fields
                      const keyId = apiKey._id || apiKey.id || Math.random().toString();
                      // Prioritize name from the apiKey object, which may be enhanced from localStorage
                      const keyName = apiKey.name || apiKey.emailConfig?.email || apiKey.email || "Unnamed API Key";
                      const keyEmail = apiKey.emailConfig?.email || apiKey.email || "—";
                      const keyCreatedAt = apiKey.createdAt ? new Date(apiKey.createdAt) : new Date();
                      const keyValue = apiKey.key || "••••••••••••";
                      
                      return (
                        <tr key={keyId} className="api-key-row">
                          <td className="api-key-name">
                            {keyName}
                            <span className="mobile-details">
                              {keyEmail !== keyName ? keyEmail : ""}
                              <span className="mobile-created">
                                {keyCreatedAt.toLocaleDateString()}
                              </span>
                              
                              {/* Mobile delete button */}
                              <button
                                className="mobile-delete-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(apiKey);
                                }}
                                aria-label={`Delete API key ${keyName}`}
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </span>
                          </td>
                          <td className="hide-on-medium api-key-email">
                            {keyEmail}
                          </td>
                          <td className="hide-on-mobile api-key-value">
                            {"*".repeat(12)}
                            {keyValue.substring(keyValue.length - 4)}
                          </td>
                          <td className="hide-on-mobile api-key-date">
                            {keyCreatedAt.toLocaleString()}
                          </td>
                          <td className="td-action desktop-only-action">
                            <button
                              className="btn-ghost-icon"
                              onClick={() => handleDeleteClick(apiKey)}
                              aria-label={`Delete API key ${keyName}`}
                            >
                              <Trash2 className="trash-icon" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
          apiKeyData={newApiKeyData}
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
