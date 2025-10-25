# Orion - AI-Powered Career Tools

A modern React-based SPA for AI-powered resume optimization, job fit analysis, and career tools. Built with React, Vite, and Express.js backend.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys
Create or edit `config.env` file with your API keys:
```env
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
PORT=3000
```

### 3. Development Mode

**Option A: Run React + Backend separately (recommended for development)**
```bash
# Terminal 1: Start Vite dev server (React frontend)
npm run dev

# Terminal 2: Start backend server
npm start
```
- Frontend: `http://localhost:5173` (with hot reload)
- Backend API: `http://localhost:3000`

**Option B: Run production build with backend**
```bash
# Build React app
npm run build

# Start backend (serves React build)
npm start
```
- Full app: `http://localhost:3000`

### 4. Production Deployment
```bash
# Build React app for production
npm run build

# Start production server
npm run prod

# Or use PM2 for process management
npm run pm2:start
```

## 📁 Project Structure

```
orion/
├── src/                  # React application source
│   ├── components/
│   │   ├── pages/       # Page components (Home, Resume, Cater, Jobfit, Signup)
│   │   ├── Layout.jsx   # Main layout wrapper
│   │   └── Navbar.jsx   # Navigation component
│   ├── services/
│   │   └── api.js       # API service layer
│   ├── styles/
│   │   └── main.css     # Global styles
│   ├── utils/
│   │   └── pdfParser.js # PDF text extraction utility
│   ├── App.jsx          # React Router setup
│   └── main.jsx         # Entry point
├── dist/                # Production build output (generated)
├── server.js            # Development/production Express server
├── server-production.js # Production server with rate limiting
├── ecosystem.config.cjs # PM2 configuration
├── vite.config.js       # Vite build configuration
├── config.env           # Environment variables (API keys)
├── package.json         # Dependencies and scripts
└── index.html           # HTML template for Vite
```

## ✨ Features

### Frontend (React SPA)
- **Modern React 18** with React Router for client-side routing
- **Vite** for lightning-fast development and optimized production builds
- **PDF Support** - Upload and parse PDF resumes using pdfjs-dist
- **Responsive Design** - Mobile-friendly UI with modern styling
- **Real-time API Integration** - Connects to backend AI services

### Backend (Express.js)
- **CORS Enabled** - Configured for development and production
- **API Proxy** - Forwards requests to Anthropic Claude & OpenAI GPT APIs
- **Rate Limiting** - Protection against abuse (production mode)
- **Error Handling** - Comprehensive error handling and logging
- **SPA Support** - Serves React build with client-side routing fallback
- **Health Check** - `/health` endpoint to verify server status

## 🌐 API Endpoints

- `GET /health` - Server health check
- `POST /api/rewrite-resume` - Resume rewriting (resume.js)
- `POST /api/extract-job-description` - Job description extraction (cater.js)
- `POST /api/tailor-resume` - Resume tailoring for specific jobs (cater.js)
- `POST /api/test-api-key` - API key validation (jobfit.js)
- `POST /api/analyze-job-fit` - Job fit analysis (jobfit.js)
- Static file serving for all your frontend files

## 🔒 Security

- API key stored in environment variables
- CORS configured for local development only
- Input validation and sanitization
- Error messages don't expose sensitive information

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify Node.js is installed
- Check `config.env` file exists and has correct API key

### CORS errors
- Backend should be running on port 3000
- Frontend should be accessed via localhost (not file://)
- Check browser console for specific error messages

### API errors
- Verify Anthropic API key is valid
- Check backend console logs for detailed error information
- Ensure resume text is not too long (>10MB limit)

## 📝 Development

To modify the backend:
1. Edit `server.js`
2. Restart the server or use `npm run dev` for auto-restart
3. Check console logs for debugging information

To modify the frontend:
1. Edit HTML/CSS/JS files
2. Refresh browser (no restart needed)
3. Backend serves static files automatically
