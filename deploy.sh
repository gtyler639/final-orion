#!/bin/bash

# Resume Rewriter VPS Deployment Script
# Run this script on your VPS after uploading your project files

echo "🚀 Starting Resume Rewriter deployment..."

# Set variables
PROJECT_DIR="/var/www/resume-rewriter"
SERVICE_NAME="resume-rewriter"
DOMAIN="yourdomain.com"  # Replace with your actual domain

# Create project directory if it doesn't exist
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

echo "📁 Setting up project directory..."

# Set proper permissions
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create production environment file
echo "🔧 Setting up environment variables..."
cat > .env << EOF
ANTHROPIC_API_KEY=sk-ant-api03-d50yHQnCc0pdDxwigQ_7k1g_hRWllKlCCd4cs0_gH_T11Zz5StjvZHSLITu0G6th8fYuTP4zUwA
PORT=3000
NODE_ENV=production
EOF

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.cjs << EOF
module.exports = {
  apps: [{
    name: '$SERVICE_NAME',
    script: 'server-production.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Create Nginx configuration
echo "🌐 Setting up Nginx configuration..."
cat > /etc/nginx/sites-available/$SERVICE_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL configuration (will be updated after certificate generation)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Static files
    location / {
        root $PROJECT_DIR;
        try_files \$uri \$uri/ @nodejs;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Fallback to Node.js
    location @nodejs {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/$SERVICE_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

# Reload Nginx
systemctl reload nginx

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at: http://$DOMAIN"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs $SERVICE_NAME"
echo ""
echo "🔒 Next steps:"
echo "1. Update the domain in the script and run again"
echo "2. Set up SSL certificate with: certbot --nginx -d $DOMAIN"
echo "3. Test your application"













