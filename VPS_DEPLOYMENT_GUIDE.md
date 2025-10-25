# 🚀 DigitalOcean VPS Deployment Guide

Complete guide to deploy your Resume Rewriter project to DigitalOcean VPS.

## 📋 Prerequisites

- DigitalOcean VPS running Ubuntu 20.04+ or CentOS 7+
- Root access to your VPS
- Domain name pointing to your VPS IP
- Anthropic API key

## 🔧 VPS Setup (if not already done)

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PM2
```bash
sudo npm install -g pm2
```

### 4. Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Install Certbot (for SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

## 📁 Upload Your Project

### Option A: Using SCP (Recommended)
```bash
# From your local machine
scp -r "C:\Users\gtyle\OneDrive\Desktop\New folder" root@YOUR_VPS_IP:/var/www/resume-rewriter
```

### Option B: Using Git
```bash
# On your VPS
cd /var/www
git clone https://github.com/yourusername/resume-rewriter.git
```

### Option C: Using SFTP
- Use FileZilla or similar SFTP client
- Upload all files to `/var/www/resume-rewriter/`

## 🚀 Deploy the Application

### 1. Connect to Your VPS
```bash
ssh root@YOUR_VPS_IP
```

### 2. Navigate to Project Directory
```bash
cd /var/www/resume-rewriter
```

### 3. Make Deploy Script Executable
```bash
chmod +x deploy.sh
```

### 4. Edit Domain in Deploy Script
```bash
nano deploy.sh
# Replace "yourdomain.com" with your actual domain
```

### 5. Run Deployment Script
```bash
./deploy.sh
```

## 🔧 Manual Configuration (Alternative)

If you prefer manual setup:

### 1. Install Dependencies
```bash
cd /var/www/resume-rewriter
npm install --production
```

### 2. Create Environment File
```bash
nano .env
```
Add:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=production
```

### 3. Update CORS Settings
Replace `server.js` with `server-production.js` or update CORS origins:
```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];
```

### 4. Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 5. Configure Nginx
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/resume-rewriter
```

Add the configuration from the deploy script, then:
```bash
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

## 🧪 Testing Your Deployment

### 1. Test Health Endpoint
```bash
curl http://yourdomain.com/health
```

### 2. Test API Endpoint
```bash
curl -X POST http://yourdomain.com/api/test-api-key \
  -H "Content-Type: application/json"
```

### 3. Test Frontend
Visit `https://yourdomain.com` in your browser

## 📊 Monitoring and Maintenance

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs resume-rewriter

# Restart application
pm2 restart resume-rewriter

# Monitor in real-time
pm2 monit

# Stop application
pm2 stop resume-rewriter
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop

# Check system logs
sudo journalctl -u nginx
sudo journalctl -u pm2-resume-rewriter
```

## 🔧 Troubleshooting

### Common Issues

**1. Application won't start**
```bash
# Check PM2 logs
pm2 logs resume-rewriter

# Check if port is in use
sudo netstat -tlnp | grep :3000

# Kill process using port
sudo fuser -k 3000/tcp
```

**2. Nginx 502 Bad Gateway**
```bash
# Check if Node.js app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart both services
pm2 restart resume-rewriter
sudo systemctl restart nginx
```

**3. CORS Errors**
- Update CORS origins in `server-production.js`
- Restart the application: `pm2 restart resume-rewriter`

**4. SSL Certificate Issues**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
curl -I https://yourdomain.com
```

### Performance Optimization

**1. Enable Gzip Compression**
Already included in Nginx config

**2. Set Up Log Rotation**
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

**3. Monitor Resource Usage**
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor in real-time
htop
```

## 🔄 Updates and Maintenance

### Updating Your Application
```bash
# Pull latest changes
cd /var/www/resume-rewriter
git pull origin main

# Install new dependencies
npm install --production

# Restart application
pm2 restart resume-rewriter
```

### Backup Strategy
```bash
# Create backup script
nano backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/resume-rewriter_$DATE.tar.gz /var/www/resume-rewriter
find /backups -name "resume-rewriter_*.tar.gz" -mtime +7 -delete
```

## 📈 Scaling Considerations

### For High Traffic
1. **Increase PM2 instances:**
   ```javascript
   // In ecosystem.config.js
   instances: 'max' // or specific number
   ```

2. **Add Load Balancer:**
   - Use DigitalOcean Load Balancer
   - Configure multiple VPS instances

3. **Database Integration:**
   - Add Redis for caching
   - Use PostgreSQL for user data

4. **CDN Setup:**
   - Use Cloudflare or DigitalOcean Spaces
   - Serve static assets from CDN

## 🎯 Security Checklist

- ✅ Firewall configured (UFW)
- ✅ SSH key authentication only
- ✅ SSL certificate installed
- ✅ Regular security updates
- ✅ PM2 process monitoring
- ✅ Nginx security headers
- ✅ Rate limiting implemented
- ✅ API key secured in environment variables

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify all services are running
3. Test each component individually
4. Check firewall and DNS settings

---

**Your Resume Rewriter is now live at: https://yourdomain.com** 🎉













