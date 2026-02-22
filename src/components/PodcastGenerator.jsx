import { useState } from 'react'
import '../styles/PodcastGenerator.css'

function PodcastGenerator() {
    const [topic, setTopic] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Clear previous states
        setError(null)
        setAudioUrl(null)

        if (!topic.trim()) {
            setError('Please enter a podcast topic')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('https://workflow.ccbp.in/webhook-test/aea3b229-b06c-454d-9b8c-4ecfd18c899f', {
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
            setError('😔 Oops! Something went wrong. Please try again')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="workflow-card podcast-card">
            <div className="card-header">
                <h1 className="card-title podcast-title">🎙️ Podcast Generator</h1>
                <p className="card-subtitle">Create AI-powered podcasts from any topic</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="podcast-input"
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
                        <>🔊 Generate Podcast</>
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
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                ) : audioUrl ? (
                    <div className="audio-ready">
                        <p className="success-text">✨ Podcast is ready! Click play to listen</p>
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
