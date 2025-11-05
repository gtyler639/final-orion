# 🚀 Git Deployment Guide for Cal-Orion-

Complete guide to deploy your Resume Rewriter project using Git and personal access token.

## 📋 Prerequisites

- DigitalOcean VPS with Ubuntu 20.04+
- Git repository: `Cal-Orion-`
- Personal Access Token for GitHub
- Domain name pointing to your VPS IP

## 🔧 VPS Setup

### 1. Connect to Your VPS
```bash
ssh root@YOUR_VPS_IP
```

### 2. Install Required Packages
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Install Git (if not already installed)
sudo apt install git -y
```

### 3. Verify Installations
```bash
node --version    # Should show v18.x.x
npm --version     # Should show 9.x.x
pm2 --version     # Should show PM2 version
nginx -v          # Should show Nginx version
git --version     # Should show Git version
```

## 🚀 Deploy Your Application

### Step 1: Download and Configure Deployment Script

```bash
# Create project directory
mkdir -p /var/www/resume-rewriter
cd /var/www/resume-rewriter

# Download the deployment script
wget https://raw.githubusercontent.com/YOUR_USERNAME/Cal-Orion-/main/git-deploy.sh
# OR upload the git-deploy.sh file manually

# Make it executable
chmod +x git-deploy.sh
```

### Step 2: Edit Configuration

```bash
nano git-deploy.sh
```

Update these variables in the script:
```bash
DOMAIN="yourdomain.com"  # Replace with your actual domain
GIT_REPO="https://github.com/YOUR_USERNAME/Cal-Orion-.git"  # Your repo URL
GIT_TOKEN="your_personal_access_token"  # Your GitHub token
```

### Step 3: Run Deployment

```bash
./git-deploy.sh
```

## 🔑 Setting Up Personal Access Token

### 1. Create GitHub Personal Access Token

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "VPS Deployment"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 2. Test Token Access

```bash
# Test if your token works
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

## 🔄 Alternative Manual Deployment

If you prefer manual setup:

### 1. Clone Repository
```bash
cd /var/www
git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/Cal-Orion-.git resume-rewriter
cd resume-rewriter
```

### 2. Install Dependencies
```bash
npm install --production
```

### 3. Set Up Environment
```bash
nano .env
```
Add:
```
ANTHROPIC_API_KEY=sk-ant-api03-d50yHQnCc0pdDxwigQ_7k1g_hRWllKlCCd4cs0_gH_T11Zz5StjvZHSLITu0G6th8fYuTP4zUwA
PORT=3000
NODE_ENV=production
```

### 4. Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 5. Configure Nginx
```bash
# Copy the Nginx config from git-deploy.sh
sudo nano /etc/nginx/sites-available/resume-rewriter
# Paste the configuration and update domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/resume-rewriter /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Certificate Setup

### 1. Get SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 2. Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

## 🔄 Updating Your Application

### Method 1: Using Update Script
```bash
cd /var/www/resume-rewriter
./update.sh
```

### Method 2: Manual Update
```bash
cd /var/www/resume-rewriter
git pull origin main
npm install --production
pm2 restart resume-rewriter
```

## 📊 Monitoring and Management

### PM2 Commands
```bash
# View application status
pm2 status

# View logs
pm2 logs resume-rewriter

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart resume-rewriter

# Stop application
pm2 stop resume-rewriter

# View detailed info
pm2 show resume-rewriter
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

## 🧪 Testing Your Deployment

### 1. Test Health Endpoint
```bash
curl https://yourdomain.com/health
```

### 2. Test API Endpoint
```bash
curl -X POST https://yourdomain.com/api/test-api-key \
  -H "Content-Type: application/json"
```

### 3. Test Frontend
Visit `https://yourdomain.com` in your browser

## 🔧 Troubleshooting

### Common Issues

**1. Git Authentication Failed**
```bash
# Check if token is correct
git remote -v

# Update remote URL with token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/Cal-Orion-.git
```

**2. Application Won't Start**
```bash
# Check PM2 logs
pm2 logs resume-rewriter

# Check if port is in use
sudo netstat -tlnp | grep :3000

# Kill process using port
sudo fuser -k 3000/tcp
```

**3. Nginx 502 Bad Gateway**
```bash
# Check if Node.js app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart both services
pm2 restart resume-rewriter
sudo systemctl restart nginx
```

**4. CORS Errors**
- Update CORS origins in `server-production.js`
- Restart the application: `pm2 restart resume-rewriter`

## 🔄 Automated Updates (Optional)

### Set Up Cron Job for Auto-Updates
```bash
# Edit crontab
crontab -e

# Add this line to check for updates every hour
0 * * * * cd /var/www/resume-rewriter && git pull && npm install --production && pm2 restart resume-rewriter
```

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Already included in Nginx config

### 2. Set Up Log Rotation
```bash
sudo nano /etc/logrotate.d/resume-rewriter
```
Add:
```
/var/www/resume-rewriter/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Monitor Resource Usage
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor in real-time
htop
```

## 🎯 Security Checklist

- ✅ Personal access token secured
- ✅ Firewall configured (UFW)
- ✅ SSH key authentication only
- ✅ SSL certificate installed
- ✅ PM2 process monitoring
- ✅ Nginx security headers
- ✅ Rate limiting implemented
- ✅ API key secured in environment variables
- ✅ Git repository access properly configured

## 📞 Support

If you encounter issues:
1. Check the logs first: `pm2 logs resume-rewriter`
2. Verify all services are running: `pm2 status`
3. Test each component individually
4. Check firewall and DNS settings

---

**Your Resume Rewriter is now live at: https://yourdomain.com** 🎉

**To update in the future, just run:**
```bash
cd /var/www/resume-rewriter && ./update.sh
```


















