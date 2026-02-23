import { useState } from 'react'
import SocialMediaPost from './components/SocialMediaPost'
import PodcastGenerator from './components/PodcastGenerator'
import ThumbnailGenerator from './components/ThumbnailGenerator'
import './App.css'

function App() {
  const [activeWorkflow, setActiveWorkflow] = useState('social')

  return (
    <div className="app-container">
      <div className="workflow-selector">
        <button
          className={`workflow-tab ${activeWorkflow === 'social' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('social')}
        >
          📱 Social
        </button>
        <button
          className={`workflow-tab podcast ${activeWorkflow === 'podcast' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('podcast')}
        >
          🎙️ Podcast
        </button>
        <button
          className={`workflow-tab thumbnail ${activeWorkflow === 'thumbnail' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('thumbnail')}
        >
          ✨ Thumbnail
        </button>
      </div>

      {activeWorkflow === 'social' && <SocialMediaPost />}
      {activeWorkflow === 'podcast' && <PodcastGenerator />}
      {activeWorkflow === 'thumbnail' && <ThumbnailGenerator />}
    </div>
  )
}

export default App
