import { useState } from 'react'
import { FiImage, FiAlertCircle } from 'react-icons/fi'
import '../styles/ThumbnailGenerator.css'

function ThumbnailGenerator() {
    const [prompt, setPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const [error, setError] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)
        setImageUrl(null)

        if (!prompt.trim()) {
            setError({ text: 'Please describe what your thumbnail should show', icon: FiAlertCircle })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/api/webhook/thumbnail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: prompt }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            console.log('Full Response:', data)

            // Handle different response structures
            let imgUrl = null

            // Check if response is an array (n8n format)
            if (Array.isArray(data) && data.length > 0) {
                // Extract from body.result.urls[0]
                imgUrl = data[0]?.body?.result?.urls?.[0]
            } else if (data.body?.result?.urls?.[0]) {
                // Direct object with body.result.urls
                imgUrl = data.body.result.urls[0]
            } else if (data.result?.urls?.[0]) {
                // Object with result.urls
                imgUrl = data.result.urls[0]
            } else if (data.urls?.[0]) {
                // Object with urls array
                imgUrl = data.urls[0]
            } else {
                // Fallback to common field names
                imgUrl = data.imageUrl || data.image || data.url
            }

            if (imgUrl) {
                setImageUrl(imgUrl)
                setPrompt('')
            } else {
                console.error('Could not find image URL in response:', data)
                throw new Error('No image in response')
            }

        } catch (error) {
            console.error('Error:', error)
            setError({ text: 'Something went wrong. Please try again.', icon: FiAlertCircle })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = 'thumbnail.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <div className="workflow-card">
            <div className="card-header">
                <div className="card-title-with-icon">
                    <FiImage className="card-icon thumbnail-icon" />
                    <h1 className="card-title">Thumbnail Generator</h1>
                </div>
                <p className="card-subtitle">Create beautiful thumbnails with AI</p>
            </div>

            {!imageUrl ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <textarea
                            className="workflow-input thumbnail-textarea"
                            placeholder="What should your thumbnail show?"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                            rows="4"
                        />
                    </div>

                    <button
                        type="submit"
                        className="create-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        ) : (
                            'Create Thumbnail'
                        )}
                    </button>

                    {error && (
                        <div className="message error">
                            {error.icon && <error.icon />}
                            <p>{error.text}</p>
                        </div>
                    )}
                </form>
            ) : (
                <div className="result-container">
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="Generated thumbnail" className="generated-image" />
                    </div>
                    <div className="action-buttons">
                        <button onClick={handleDownload} className="download-button">
                            Download
                        </button>
                        <button onClick={() => setImageUrl(null)} className="create-another-button">
                            Create Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ThumbnailGenerator
