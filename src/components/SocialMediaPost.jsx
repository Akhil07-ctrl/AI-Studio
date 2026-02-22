import { useState } from 'react'
import '../styles/SocialMediaPost.css'

function SocialMediaPost() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setMessage(null)

        if (!url.trim()) {
            setMessage({ type: 'error', text: 'Please enter a URL' })
            return
        }

        setIsLoading(true)

        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000))

        try {
            const apiCall = fetch('https://workflow.ccbp.in/webhook-test/effd5adb-e750-4d4b-8fc9-03def3e32aa8', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: url }),
            })

            const [response] = await Promise.all([apiCall, minLoadingTime])

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            setMessage({
                type: 'success',
                text: '✨ Successfully posted!'
            })

            setUrl('')
            console.log('Response:', data)

        } catch (error) {
            console.error('Error:', error)
            setMessage({
                type: 'error',
                text: '😔 Oops! Something went wrong. Please try again.'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="workflow-card">
            <div className="card-header">
                <h1 className="card-title">Create Social Post</h1>
                <p className="card-subtitle">Share your content with the world</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="url-input"
                        placeholder="Provide the URL here…"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
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
                    {message.text}
                </div>
            )}
        </div>
    )
}

export default SocialMediaPost
