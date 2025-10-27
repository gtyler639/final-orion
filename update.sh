#!/bin/bash

# Resume Rewriter Update Script
# Run this script to update your application from Git

echo "🔄 Updating Resume Rewriter application..."

# Set variables
PROJECT_DIR="/var/www/resume-rewriter"
SERVICE_NAME="resume-rewriter"

# Navigate to project directory
cd $PROJECT_DIR

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install any new dependencies
echo "📦 Installing/updating dependencies..."
npm install --production

# Restart the application
echo "🚀 Restarting application..."
pm2 restart $SERVICE_NAME

# Check status
echo "📊 Application status:"
pm2 status $SERVICE_NAME

echo "✅ Update completed!"
echo "🌐 Your application is now running the latest version"
echo "📝 View logs with: pm2 logs $SERVICE_NAME"














