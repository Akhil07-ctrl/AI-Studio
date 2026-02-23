import { useState } from 'react'
import { FiLinkedin, FiLock, FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'
import '../styles/SocialMediaPost.css'

function SocialMediaPost() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [showPinModal, setShowPinModal] = useState(false)
    const [pin, setPin] = useState('')
    const [pinError, setPinError] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    const handleSubmit = async (e) => {
        e.preventDefault()

        setMessage(null)
        setPinError(null)

        if (!url.trim()) {
            setMessage({ type: 'error', text: 'Please enter a URL', icon: FiAlertCircle })
            return
        }

        setShowPinModal(true)
    }

    const handlePinSubmit = async (e) => {
        e.preventDefault()

        if (!pin || pin.length === 0) {
            setPinError('Please enter your PIN')
            return
        }

        if (pin.length < 6) {
            setPinError('PIN must be 6 digits')
            return
        }

        setIsLoading(true)
        setPinError(null)

        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000))

        try {
            const apiCall = fetch(`${API_BASE_URL}/api/webhook/social-media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: url,
                    pin: pin
                }),
            })

            const [response] = await Promise.all([apiCall, minLoadingTime])

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    setPinError(data.message || 'Invalid PIN. Please try again.')
                    setIsLoading(false)
                    setPin('')
                    return
                }
                throw new Error(data.message || 'Network response was not ok')
            }

            setMessage({
                type: 'success',
                text: 'Successfully posted!',
                icon: FiCheckCircle
            })

            setUrl('')
            setPin('')
            setShowPinModal(false)
            console.log('Response:', data)

        } catch (error) {
            console.error('Error:', error)
            setMessage({
                type: 'error',
                text: '😔 Oops! Something went wrong. Please try again.'
            })
            setShowPinModal(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
        setPin(value)
        setPinError(null)
    }

    const handleClosePinModal = () => {
        if (!isLoading) {
            setShowPinModal(false)
            setPin('')
            setPinError(null)
        }
    }

    return (
        <>
            <div className="workflow-card">
                <div className="card-header">
                    <div className="card-title-with-icon">
                        <FiLinkedin className="card-icon" />
                        <h1 className="card-title">Create LinkedIn Post</h1>
                    </div>
                    <p className="card-subtitle">Share your content with LinkedIn (Protected)</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="url-input"
                            placeholder="Provide the URL here…"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isLoading || showPinModal}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading || showPinModal}
                    >
                        {isLoading ? (
                            <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        ) : (
                            'Create Post'
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.icon && <message.icon />}
                        {message.text}
                    </div>
                )}
            </div>

            {/* PIN Modal */}
            {showPinModal && (
                <div className="pin-modal-overlay">
                    <div className="pin-modal">
                        <div className="pin-modal-header">
                            <div className="pin-header-icon">
                                <FiLock className="lock-icon" />
                            </div>
                            <h2>Enter your PIN</h2>
                            <p>This action is protected. Enter your 6-digit PIN to post on LinkedIn.</p>
                        </div>

                        <form onSubmit={handlePinSubmit} className="pin-form">
                            <div className="pin-input-wrapper">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="hidden-pin-input"
                                    value={pin}
                                    onChange={handlePinChange}
                                    maxLength="6"
                                    disabled={isLoading}
                                    autoFocus
                                    aria-label="Enter 6-digit PIN"
                                />
                                <div 
                                    className="pin-digits-container" 
                                    onClick={() => document.querySelector('.hidden-pin-input')?.focus()}
                                >
                                    {[...Array(6)].map((_, index) => (
                                        <div 
                                            key={index} 
                                            className={`pin-digit-box ${index === pin.length ? 'active' : ''} ${pin[index] ? 'filled' : ''}`}
                                        >
                                            {pin[index] ? '*' : ''}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {pinError && (
                                <div className="pin-error">
                                    <FiX className="error-icon" />
                                    {pinError}
                                </div>
                            )}

                            <div className="pin-modal-actions">
                                <button
                                    type="button"
                                    className="pin-cancel-btn"
                                    onClick={handleClosePinModal}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="pin-submit-btn"
                                    disabled={isLoading || pin.length < 6}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify & Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default SocialMediaPost

