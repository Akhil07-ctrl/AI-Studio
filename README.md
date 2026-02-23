# AI Studio 🤖

AI Studio is a comprehensive full-stack application for AI-powered content creation. It features a React frontend and Express backend, offering seamless experience for generating social media posts, podcasts, and thumbnails.

## 🚀 Features

### 1. 📱 Social Media Post Generator
Generate engaging social media content instantly.
- Input a URL or topic
- Get AI-crafted posts ready for sharing
- Powered by secure backend API

### 2. 🎙️ Podcast Generator
Transform text topics into audio podcasts.
- Enter a topic of interest
- AI generates and converts to audio
- Integrated audio player for listening

### 3. ✨ Thumbnail Generator
Create eye-catching thumbnails for your content.
- Describe your desired image
- AI generates high-quality thumbnails
- Download or regenerate options available

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 7
- **Backend:** Express.js, Node.js
- **Styling:** CSS (Custom styles)
- **State Management:** React Hooks
- **API:** RESTful API with Express
- **CORS:** Backend-handled with secure configuration

## 📁 Project Structure

```
ai-studio/
├── client/              # React Frontend (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
│
├── server/              # Express Backend (Port 5000)
│   ├── src/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── middleware/
│   │   └── index.js
│   └── package.json
│
└── package.json         # Root workspace config
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd ai-studio

# 2. Install all dependencies
npm run install:all
```

### Running Development Environment

```bash
# Run both client (5173) and server (5000) simultaneously
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend (Port 5000)
npm run dev:server

# Terminal 2 - Frontend (Port 5173)
npm run dev:client
```

Then open http://localhost:5173 in your browser.

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Backend status

### Webhook API
All endpoints are under `/api/webhook/`:

1. **Social Media Post**
   ```
   POST /api/webhook/social-media
   Body: { "text": "url_or_content" }
   ```

2. **Podcast Generator**
   ```
   POST /api/webhook/podcast
   Body: { "text": "topic" }
   Response: { "audioFile": "url" }
   ```

3. **Thumbnail Generator**
   ```
   POST /api/webhook/thumbnail
   Body: { "text": "prompt" }
   Response: Image URL
   ```

## 🔧 Environment Configuration

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000  # Backend URL
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173  # For CORS
```

## 📦 Build & Deployment

### Build for Production
```bash
# Build both client and server
npm run build

# Or individually
npm run build:client
npm run dev:server    # For production use: npm start -w server
```

### Deploy Backend (Railway Recommended)

1. Sign up at [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select `/server` as root directory
4. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

### Deploy Frontend (Vercel Recommended)

1. Deploy at [vercel.com](https://vercel.com)
2. Build settings:
   - Build Command: `npm run build:client`
   - Output Directory: `client/dist`
3. Environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

## 🔐 CORS & Security

- Backend has secure CORS configuration
- Supports development (localhost) and production URLs
- Set `FRONTEND_URL` environment variable for production

## 📝 Available Scripts

```bash
# Root Level
npm run dev              # Run client & server
npm run dev:client       # Frontend only
npm run dev:server       # Backend only
npm run build            # Build both
npm run start            # Start production server

# Individual (cd client or cd server)
npm run dev              # Development
npm run build            # Production build
npm start                # Start (server only)
npm run lint             # Linting (client only)
```

## 🐛 Troubleshooting

### CORS Issues
- Verify `VITE_API_URL` in client `.env.local` matches backend URL
- Check `FRONTEND_URL` in backend `.env` for allowed origins

### Connection Errors
- Ensure backend runs on port 5000: `GET http://localhost:5000/api/health`
- Check frontend runs on port 5173

### Dependencies Issues
```bash
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit: `git commit -m "feat: description"`
3. Push: `git push origin feature/name`
4. Open Pull Request

## 📄 License

ISC

---

**Deployed at:** https://ai-studio-five-theta.vercel.app
