# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered resume and career tools application called "Orion". It's a modern React SPA (Single Page Application) built with:
- **React 18** for the frontend UI
- **Vite** for development and build tooling
- **Express.js** backend API server
- **Anthropic Claude** and **OpenAI GPT** for AI-powered features
- **PDF.js** for resume file parsing

## Key Commands

### Development
```bash
# Install dependencies
npm install

# Development (recommended): Run frontend and backend separately
# Terminal 1: Start Vite dev server (React with hot reload)
npm run dev  # Runs on http://localhost:5173

# Terminal 2: Start Express backend
npm start  # Runs on http://localhost:3000

# Alternative: Build and serve production version locally
npm run build  # Build React app to dist/
npm start  # Serve dist/ through Express

# Preview Vite production build (without backend)
npm run preview
```

### Production Deployment
```bash
# Start production server with Node
npm run prod

# Deploy with PM2 process manager
npm run pm2:start

# Monitor PM2 processes
npm run pm2:monit

# View PM2 logs
npm run pm2:logs

# Restart PM2 service
npm run pm2:restart

# Stop PM2 service
npm run pm2:stop
```

### Testing
```bash
# Test backend health
curl http://localhost:3000/health

# Manual API endpoint testing - test the resume rewriting
curl -X POST http://localhost:3000/api/rewrite-resume \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "Test resume content"}'
```

## Architecture

### React Frontend (`src/` directory)

**Tech Stack**:
- React 18 with React Router for SPA navigation
- Vite for development server and production builds
- Modular component architecture
- CSS with responsive design
- PDF.js for client-side PDF parsing

**Component Structure**:
- `App.jsx` - React Router configuration
- `main.jsx` - Application entry point
- `components/Layout.jsx` - Wraps all pages with Navbar
- `components/Navbar.jsx` - Navigation bar with responsive mobile menu
- `components/pages/` - Page components (Home, Resume, Cater, Jobfit, Signup)
- `services/api.js` - Centralized API service layer
- `utils/pdfParser.js` - PDF text extraction utility

**Development vs Production**:
- Dev: Vite dev server (port 5173) proxies `/api` requests to backend (port 3000)
- Prod: Express serves built files from `dist/` folder with SPA fallback routing

### Backend API Server

**File**: `server.js` (development) and `server-production.js` (production)

**Tech Stack**:
- Express.js server on port 3000
- CORS enabled for local development
- Proxies requests to external AI APIs (Anthropic Claude, OpenAI GPT)
- Serves static files and the legacy HTML app
- Environment variables loaded from `config.env`

**API Endpoints**:
- `POST /api/rewrite-resume` - Uses OpenAI GPT-4o-mini for resume optimization
- `POST /api/extract-job-description` - Uses Anthropic Claude to extract job descriptions from HTML
- `POST /api/tailor-resume` - Uses Anthropic Claude to tailor resumes to specific jobs
- `POST /api/test-api-key` - Validates Anthropic API key
- `POST /api/analyze-job-fit` - Uses Anthropic Claude to analyze candidate-job fit with scoring

**Important**: The backend handles API key management and acts as a proxy to avoid CORS issues and protect API keys.

### Environment Configuration

**File**: `config.env`

Required environment variables:
- `ANTHROPIC_API_KEY` - For Claude API access
- `OPENAI_API_KEY` - For GPT API access
- `PORT` - Server port (defaults to 3000)

**Security Note**: Never commit `config.env` to version control. It's included in `.gitignore`.

### Deployment Scripts

Three bash deployment scripts exist for VPS deployment:
- `deploy.sh` - General deployment script
- `git-deploy.sh` - Git-based deployment with PM2
- `update.sh` - Quick update script

All scripts handle:
- Git operations (pull, status checks)
- Dependency installation
- PM2 process management
- Service restarts

## Important Patterns and Conventions

### API Integration Pattern

Both implementations use fetch/axios to call backend endpoints:

```javascript
// Example from legacy app
const response = await fetch('/api/rewrite-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeText: text })
});
```

### Error Handling

Backend provides structured error responses:
```javascript
{
  error: 'Error message',
  message: 'Detailed error info'
}
```

Frontend implements fallback demo modes when backend is unavailable.

### AI Prompt Engineering

The application uses carefully crafted prompts for AI models:
- Resume rewriting emphasizes ATS optimization, quantified achievements, and power words
- Job fit analysis returns structured JSON with scores, strengths, gaps, and recommendations
- All prompts include role-based system messages to improve output quality

### Static Asset Organization

Images and static assets remain in the root directory for legacy compatibility:
- Legacy app references: `../../filename.ext` from nested pages
- React app should import assets or reference via public folder

## Migration Notes

**Migration Status: COMPLETE ✅**
- Legacy `app/` folder has been removed
- All functionality migrated to React SPA
- Production deployment uses React build served by Express

**React Features Implemented**:
- ✅ All API integrations working (Resume rewrite, Cater, Jobfit)
- ✅ PDF parsing for file uploads
- ✅ Full responsive design and styling
- ✅ Client-side routing with React Router
- ✅ Error handling and loading states
- ✅ Production build configuration

## Common Development Tasks

### Adding a New AI Feature

1. Add API endpoint in `server.js`:
   - Define route handler
   - Validate request body
   - Call AI API with appropriate prompt
   - Handle response and errors
2. Update corresponding frontend (legacy or React):
   - Add UI controls
   - Implement fetch call to new endpoint
   - Handle loading states and errors
   - Display results to user
3. Test with backend running on port 3000

### Modifying AI Prompts

1. Locate prompt in `server.js` endpoint
2. Update prompt text while maintaining:
   - Clear role definitions
   - Expected output format (JSON, markdown, etc.)
   - Token limits (defined in `max_tokens`)
3. Test with various inputs to ensure quality

### Updating Navigation

**Legacy app**: Update links in each HTML file (navigation elements use relative paths like `../page/file.html`)

**React app**: Update routes in `src/App.jsx` and navigation in `src/components/Layout.jsx` or `src/components/Navbar.jsx`

## Testing Workflow

1. Start backend: `npm start` or `npm run dev`
2. Verify health: Visit `http://localhost:3000/health`
3. For legacy app: Visit `http://localhost:3000` (serves index page)
4. For React app: Run `npm run dev` (Vite) and visit `http://localhost:5173`
5. Test API endpoints via browser network tab or curl

## Known Issues

1. **Model name verification needed**: Backend uses `claude-4` model name which should be verified against current Anthropic API model names (may need to use `claude-3-opus-20240229` or similar).
2. **CORS configuration**: The CORS origins list includes a specific IP address (159.203.136.138) which appears to be a VPS. Update this for your deployment environment.

## File Organization

```
orion/
├── src/                   # React application source
│   ├── components/
│   │   ├── pages/        # Page components (Home, Resume, Cater, Jobfit, Signup)
│   │   ├── Layout.jsx    # Main layout wrapper
│   │   └── Navbar.jsx    # Navigation component
│   ├── services/
│   │   └── api.js        # API service layer
│   ├── styles/
│   │   └── main.css      # Global styles
│   ├── utils/
│   │   └── pdfParser.js  # PDF text extraction
│   ├── App.jsx           # React Router setup
│   └── main.jsx          # Entry point
├── dist/                  # Production build output (generated by Vite)
├── public/                # Static assets (images, etc.)
├── server.js              # Development/production backend
├── server-production.js   # Production backend with rate limiting
├── ecosystem.config.cjs   # PM2 configuration
├── vite.config.js         # Vite build configuration
├── config.env             # Environment variables (not in git)
├── index.html             # HTML template for Vite
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
└── CLAUDE.md              # This file
```

## Dependencies

**Backend**:
- express - Web server framework
- cors - CORS middleware
- node-fetch - HTTP client for AI API calls
- dotenv - Environment variable management

**Frontend (React)**:
- react & react-dom - UI framework
- react-router-dom - Client-side routing
- axios - HTTP client
- styled-components - CSS-in-JS styling
- vite - Build tool and dev server
- @vitejs/plugin-react - React integration for Vite

**Process Management**:
- pm2 (installed globally for production)
