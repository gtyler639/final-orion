# Deployment Guide - Orion React App

## Prerequisites

- Node.js 16+ and npm 8+
- Git (for deployment scripts)
- PM2 (for production process management): `npm install -g pm2`

## Local Development

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create config.env file
cat > config.env << 'EOF'
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
PORT=3000
NODE_ENV=development
EOF

# 3. Start development servers
# Terminal 1: Frontend with hot reload
npm run dev

# Terminal 2: Backend API server
npm start
```

Access the app:
- Frontend: http://localhost:5173 (Vite dev server with HMR)
- Backend API: http://localhost:3000

### Development Workflow

**Frontend changes** (components, styles):
- Edit files in `src/`
- Changes auto-reload in browser

**Backend changes** (API endpoints):
- Edit `server.js`
- Restart `npm start` (or use `nodemon server.js` for auto-restart)

## Production Build & Test

```bash
# 1. Build React app for production
npm run build

# 2. Test production build locally
npm start
# Visit http://localhost:3000

# 3. Verify all features work:
# - Navigation between pages
# - Resume rewriting
# - Job fit analysis
# - Resume tailoring (Cater)
# - PDF uploads
```

## VPS Deployment

### Initial Setup

```bash
# 1. SSH into your VPS
ssh user@your-vps-ip

# 2. Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# 3. Clone/upload your code to VPS
git clone your-repo-url orion
cd orion

# 4. Install dependencies
npm install

# 5. Create production config.env
nano config.env
# Add your production API keys
```

### Deploy with PM2

```bash
# 1. Build the React app
npm run build

# 2. Start with PM2
npm run pm2:start

# 3. Save PM2 process list and configure startup
pm2 save
pm2 startup
# Follow the instructions shown

# 4. Check status
pm2 status
pm2 logs orion-react-app
```

### PM2 Management Commands

```bash
# View logs
npm run pm2:logs

# Monitor processes
npm run pm2:monit

# Restart app
npm run pm2:restart

# Stop app
npm run pm2:stop

# Delete from PM2
pm2 delete orion-react-app
```

## Updates & Redeployment

### Using Git Deployment Script

```bash
# On VPS: Pull latest code and restart
./git-deploy.sh
```

The script will:
1. Check git status
2. Pull latest changes
3. Install new dependencies (if package.json changed)
4. Build React app
5. Restart PM2 process

### Manual Update

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies (if package.json changed)
npm install

# 3. Rebuild React app
npm run build

# 4. Restart PM2
npm run pm2:restart
```

## Environment Configuration

### Development (`config.env`)
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
PORT=3000
NODE_ENV=development
```

### Production (`config.env`)
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
PORT=3000
NODE_ENV=production
```

## Nginx Reverse Proxy (Optional)

If you want to serve on port 80/443 with SSL:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:
```bash
sudo ln -s /etc/nginx/sites-available/orion /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

### PM2 app won't start
```bash
# Check logs
pm2 logs orion-react-app --lines 100

# Check if dist/ folder exists
ls -la dist/

# Manually test server
node server-production.js
```

### API errors
```bash
# Verify environment variables
cat config.env

# Test API health
curl http://localhost:3000/health

# Test backend directly
curl -X POST http://localhost:3000/api/rewrite-resume \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "test"}'
```

### CORS issues
- Check allowed origins in `server.js` and `server-production.js`
- Update with your production domain/IP
- Restart server after changes

## Performance Optimization

### Vite Build Optimizations (already configured)
- Code splitting with manual chunks
- Terser minification
- Tree-shaking
- Asset optimization

### Server Optimizations
- Gzip compression (add if needed)
- Static file caching headers
- Rate limiting (included in production server)

## Security Checklist

- [ ] `config.env` not committed to git
- [ ] API keys are production keys (not dev/test keys)
- [ ] CORS origins updated for production domain
- [ ] Rate limiting enabled (server-production.js)
- [ ] PM2 running as non-root user
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] SSL certificate installed (Let's Encrypt recommended)

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
```

### Check Application Logs
```bash
# View PM2 logs
pm2 logs orion-react-app

# View specific log files (if configured)
tail -f logs/out.log
tail -f logs/err.log
```

### Health Check
```bash
curl http://your-domain.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Resume Rewriter Backend is running",
  "timestamp": "2024-...",
  "environment": "production"
}
```
