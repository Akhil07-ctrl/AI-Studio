import { useState } from 'react'
import { FiMic, FiVolume2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import '../styles/PodcastGenerator.css'

function PodcastGenerator() {
    const [topic, setTopic] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState(null)
    const [error, setError] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Clear previous states
        setError(null)
        setAudioUrl(null)

        if (!topic.trim()) {
            setError({ text: 'Please enter a podcast topic', icon: FiAlertCircle })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/api/webhook/podcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: topic }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            // Set the audio URL from the response
            if (data.audioFile) {
                setAudioUrl(data.audioFile)
                setTopic('') // Clear the input on success
            } else {
                throw new Error('No audio file in response')
            }

            console.log('Response:', data)

        } catch (error) {
            console.error('Error:', error)
            setError({ text: 'Oops! Something went wrong. Please try again', icon: FiAlertCircle })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="workflow-card">
            <div className="card-header">
                <div className="card-title-with-icon">
                    <FiMic className="card-icon podcast-icon" />
                    <h1 className="card-title">Podcast Generator</h1>
                </div>
                <p className="card-subtitle">Create AI-powered podcasts from any topic</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="workflow-input podcast-input"
                        placeholder="Type podcast topic here..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="podcast-button"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    ) : (
                        <>
                            <FiVolume2 className="button-icon" />
                            Generate Podcast
                        </>
                    )}
                </button>
            </form>

            <div className="audio-player-area">
                {isLoading ? (
                    <div className="generating-message">
                        <div className="pulse-animation"></div>
                        <p>Creating podcast... please wait!</p>
                    </div>
                ) : error ? (
                    <div className="message error">
                        {error.icon && <error.icon />}
                        <p>{error.text}</p>
                    </div>
                ) : audioUrl ? (
                    <div className="audio-ready">
                        <div className="message success">
                            <FiCheckCircle />
                            <p>Podcast is ready! Click play to listen</p>
                        </div>
                        <audio controls className="audio-player" src={audioUrl}>
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ) : (
                    <p className="placeholder-text">Podcast will appear here.</p>
                )}
            </div>
        </div>
    )
}

export default PodcastGenerator
