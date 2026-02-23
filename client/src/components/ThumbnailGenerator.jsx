import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
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
            setError('Please describe what your thumbnail should show')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/api/thumbnail`, {
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
            setError('Something went wrong. Please try again.')
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
        <div className="thumbnail-container">
            <div className="thumbnail-card">
                <div className="thumbnail-header">
                    <div className="thumbnail-title-with-icon">
                        <FiImage className="thumbnail-title-icon" />
                        <h1 className="thumbnail-title">Thumbnail Generator</h1>
                    </div>
                    <p className="thumbnail-subtitle">Create beautiful thumbnails with AI</p>
                </div>

                {!imageUrl ? (
                    <form onSubmit={handleSubmit} className="thumbnail-form">
                        <div className="form-group">
                            <textarea
                                className="thumbnail-textarea"
                                placeholder="What should your thumbnail show?"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isLoading}
                                rows="4"
                            />
                        </div>

                        {!isLoading ? (
                            <button type="submit" className="create-button">
                                Create
                            </button>
                        ) : (
                            <div className="generating-container">
                                <div className="loading-circle"></div>
                                <p className="generating-text">Generating your thumbnail...</p>
                            </div>
                        )}

                        {error && (
                            <div className="thumbnail-error">
                                <p>{error}</p>
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
        </div>
    )
}

export default ThumbnailGenerator
