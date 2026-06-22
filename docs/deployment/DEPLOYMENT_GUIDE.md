# BKSS Platform - Production Deployment Guide 🚀

## Overview
This guide covers deploying the BKSS Platform to a production environment with Nginx, PM2, SSL, and best practices for security and performance.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Preparation](#server-preparation)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL/HTTPS Setup](#ssl-https-setup)
7. [Process Management with PM2](#process-management-with-pm2)
8. [Security Hardening](#security-hardening)
9. [Monitoring & Logging](#monitoring--logging)
10. [Backup Strategy](#backup-strategy)
11. [Updates & Maintenance](#updates--maintenance)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deployment, ensure:

- [ ] Server with Ubuntu 20.04+ or similar
- [ ] Domain name pointed to server IP
- [ ] SSH access to server
- [ ] Root or sudo privileges
- [ ] Completed SETUP_GUIDE.md steps
- [ ] All local tests passing

---

## Server Preparation

### 1. Update System

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential
```

### 2. Create Application User (Optional but Recommended)

```bash
# Create dedicated user
sudo adduser bkss --disabled-password

# Add to sudo group
sudo usermod -aG sudo bkss

# Switch to user
sudo su - bkss
```

### 3. Set Up Firewall

```bash
# Install UFW if not installed
sudo apt install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 4. Install Required Software

**Follow SETUP_GUIDE.md for:**
- Node.js (v18+)
- PostgreSQL (v12+)
- PM2
- Nginx

---

## Backend Deployment

### 1. Clone Repository

```bash
# Create projects directory
mkdir -p ~/myprojects/BKSS

# Clone repository
cd ~/myprojects/BKSS
git clone <your-repo-url> bkss-platform_V1

# Or upload via SCP/SFTP
```

### 2. Install Dependencies

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/backend
npm install --production
```

### 3. Configure Environment

```bash
nano .env
```

**Production configuration:**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bkss_db
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Security - CHANGE THESE!
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE_64_CHARACTERS_MINIMUM

# Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
```

**Generate secure secrets:**
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Set Up Database

```bash
# Run migrations
cd ~/myprojects/BKSS/bkss-platform_V1
./update-database-map-location.sh

# Or manually
PGPASSWORD='your_password' psql -U postgres -d bkss_db -h localhost -f backend/schema.sql
```

### 5. Create Uploads Directory

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/backend
mkdir -p uploads
chmod 755 uploads
```

### 6. Test Backend

```bash
# Run backend
cd ~/myprojects/BKSS/bkss-platform_V1/backend
npm start

# Test in another terminal
curl http://localhost:5000/
```

Expected: `{"success":true,"message":"BKSS Backend Running"}`

---

## Frontend Deployment

### 1. Configure Environment

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/frontend
nano .env
```

**Production configuration:**
```env
VITE_API_BASE_URL=https://your-domain.com
```

**Important:** 
- Use `https://` (not `http://`)
- No trailing slash
- No `/api` suffix

### 2. Install Dependencies

```bash
npm install
```

### 3. Build for Production

```bash
npm run build
```

**Expected output:**
```
✓ 138 modules transformed.
dist/index.html                   1.04 kB
dist/assets/index-xxxxx.css       97.14 kB
dist/assets/index-xxxxx.js        774.53 kB
✓ built in 40s
```

### 4. Deploy Build Files

```bash
# Create web directory
sudo mkdir -p /var/www/bkss

# Copy build files
sudo cp -r dist/* /var/www/bkss/

# Set permissions
sudo chown -R www-data:www-data /var/www/bkss
sudo chmod -R 755 /var/www/bkss
```

### 5. Verify Deployment

```bash
# Check files exist
ls -la /var/www/bkss/

# Should see:
# index.html
# assets/
```

---

## Nginx Configuration

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bkss
```

**Complete configuration:**
```nginx
# Upstream backend
upstream backend {
    server localhost:5000;
    keepalive 64;
}

# HTTP Server (redirect to HTTPS)
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Upload limit
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Frontend (React SPA)
    root /var/www/bkss;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Backend uploads
    location /uploads/ {
        alias /home/ubuntu/myprojects/BKSS/bkss-platform_V1/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Access and error logs
    access_log /var/log/nginx/bkss_access.log;
    error_log /var/log/nginx/bkss_error.log;
}
```

### 2. Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/bkss /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3. Verify Nginx

```bash
# Check status
sudo systemctl status nginx

# Check configuration
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/bkss_access.log
sudo tail -f /var/log/nginx/bkss_error.log
```

---

## SSL/HTTPS Setup

### 1. Install Certbot

```bash
# Ubuntu 20.04+
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### 2. Obtain SSL Certificate

```bash
# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# 1. Enter email address
# 2. Agree to terms (A)
# 3. Choose to redirect HTTP to HTTPS (2)
```

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/your-domain.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/your-domain.com/privkey.pem
```

### 3. Test Auto-Renewal

```bash
# Dry run
sudo certbot renew --dry-run

# Should show: Congratulations, all simulated renewals succeeded
```

### 4. Set Up Auto-Renewal

Certbot automatically creates a cron job. Verify:

```bash
# Check cron
sudo systemctl status certbot.timer

# Manual renewal (if needed)
sudo certbot renew
```

### 5. Update Frontend .env

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/frontend
nano .env
```

**Change to HTTPS:**
```env
VITE_API_BASE_URL=https://your-domain.com
```

**Rebuild and redeploy:**
```bash
npm run build
sudo cp -r dist/* /var/www/bkss/
sudo systemctl reload nginx
```

---

## Process Management with PM2

### 1. Create Ecosystem File

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/backend
nano ecosystem.config.js
```

**Configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'bkss-backend',
    script: './src/server.js',
    instances: 2,  // Use CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 2. Create Logs Directory

```bash
mkdir -p logs
```

### 3. Start with PM2

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Copy and run the command it provides
```

### 4. PM2 Commands

```bash
# Status
pm2 status

# Logs
pm2 logs bkss-backend
pm2 logs bkss-backend --lines 100

# Restart
pm2 restart bkss-backend

# Stop
pm2 stop bkss-backend

# Delete
pm2 delete bkss-backend

# Monitor
pm2 monit

# Web dashboard
pm2 web
```

---

## Security Hardening

### 1. Update Default Admin Password

```bash
# Login to admin panel
# https://your-domain.com/login

# Email: rasmi@admin.com
# Password: admin@123

# Change password immediately!
```

### 2. Secure PostgreSQL

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Allow only localhost
local   all             postgres                                md5
host    bkss_db         postgres        127.0.0.1/32            md5

# Restart
sudo systemctl restart postgresql
```

### 3. Secure File Permissions

```bash
# Backend
chmod 700 ~/myprojects/BKSS/bkss-platform_V1/backend/.env
chmod 755 ~/myprojects/BKSS/bkss-platform_V1/backend/uploads

# Frontend
sudo chmod -R 755 /var/www/bkss
sudo chown -R www-data:www-data /var/www/bkss
```

### 4. Set Up Fail2Ban (Optional)

```bash
# Install
sudo apt install -y fail2ban

# Configure for Nginx
sudo nano /etc/fail2ban/jail.local

# Add:
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/bkss_error.log

# Restart
sudo systemctl restart fail2ban
```

### 5. Regular Security Updates

```bash
# Set up unattended upgrades
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Monitoring & Logging

### 1. PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# CPU and memory usage
pm2 status

# Application logs
pm2 logs bkss-backend --lines 100
```

### 2. Nginx Logs

```bash
# Access log
sudo tail -f /var/log/nginx/bkss_access.log

# Error log
sudo tail -f /var/log/nginx/bkss_error.log

# Analyze logs
sudo cat /var/log/nginx/bkss_access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -10
```

### 3. PostgreSQL Logs

```bash
# Find log location
sudo -u postgres psql -c "SHOW log_directory;"

# View logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 4. System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top

# Process list
ps aux | grep node
```

### 5. Set Up Log Rotation

**For PM2 logs:**
```bash
pm2 install pm2-logrotate

pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

**For Nginx logs (already configured):**
```bash
# Check configuration
cat /etc/logrotate.d/nginx
```

---

## Backup Strategy

### 1. Database Backup

**Create backup script:**
```bash
nano ~/backup-database.sh
```

**Script content:**
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/home/ubuntu/backups/database"
DB_NAME="bkss_db"
DB_USER="postgres"
DB_PASSWORD="your_password"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/bkss_db_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

**Make executable:**
```bash
chmod +x ~/backup-database.sh
```

**Test backup:**
```bash
~/backup-database.sh
```

**Automate with cron:**
```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/ubuntu/backup-database.sh >> /home/ubuntu/backup.log 2>&1
```

### 2. File Backup

**Backup uploads:**
```bash
# Create backup script
nano ~/backup-files.sh
```

**Script:**
```bash
#!/bin/bash

BACKUP_DIR="/home/ubuntu/backups/files"
SOURCE_DIR="/home/ubuntu/myprojects/BKSS/bkss-platform_V1/backend/uploads"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $(dirname $SOURCE_DIR) $(basename $SOURCE_DIR)

# Keep last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Files backup completed"
```

**Automate:**
```bash
chmod +x ~/backup-files.sh

crontab -e
# Add daily at 3 AM
0 3 * * * /home/ubuntu/backup-files.sh >> /home/ubuntu/backup.log 2>&1
```

### 3. Restore Database

```bash
# Uncompress backup
gunzip /home/ubuntu/backups/database/bkss_db_YYYYMMDD_HHMMSS.sql.gz

# Restore
PGPASSWORD='your_password' psql -U postgres -h localhost -d bkss_db < /home/ubuntu/backups/database/bkss_db_YYYYMMDD_HHMMSS.sql
```

---

## Updates & Maintenance

### 1. Update Application

**Backend update:**
```bash
cd ~/myprojects/BKSS/bkss-platform_V1

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install
pm2 restart bkss-backend

# Verify
pm2 logs bkss-backend --lines 20
```

**Frontend update:**
```bash
cd ~/myprojects/BKSS/bkss-platform_V1/frontend

# Update dependencies
npm install

# Build
npm run build

# Deploy
sudo cp -r dist/* /var/www/bkss/

# Clear cache
sudo systemctl reload nginx
```

### 2. Database Migrations

```bash
cd ~/myprojects/BKSS/bkss-platform_V1

# Run migration scripts
./update-database-map-location.sh

# Or manually
PGPASSWORD='your_password' psql -U postgres -d bkss_db -h localhost -f migration.sql
```

### 3. Zero-Downtime Deployment

```bash
# Using PM2 cluster mode
pm2 reload bkss-backend

# This gracefully reloads all instances one by one
```

### 4. Rollback Procedure

```bash
# 1. Stop current version
pm2 stop bkss-backend

# 2. Restore previous code
git checkout <previous-commit-hash>

# 3. Rebuild if needed
cd backend && npm install
cd ../frontend && npm run build && sudo cp -r dist/* /var/www/bkss/

# 4. Restart
pm2 restart bkss-backend

# 5. Restore database if needed
# (use backup from before update)
```

---

## Troubleshooting

### Backend Issues

**Problem:** Backend not starting

**Check:**
```bash
# 1. View PM2 logs
pm2 logs bkss-backend --lines 50

# 2. Check port availability
sudo lsof -i :5000

# 3. Check .env file
cat backend/.env

# 4. Test database connection
PGPASSWORD='your_password' psql -U postgres -d bkss_db -h localhost -c "SELECT 1;"

# 5. Check file permissions
ls -la backend/.env
```

**Solutions:**
```bash
# Restart backend
pm2 restart bkss-backend

# If still failing, delete and restart
pm2 delete bkss-backend
pm2 start backend/ecosystem.config.js
```

### Frontend Issues

**Problem:** 404 errors or blank page

**Check:**
```bash
# 1. Check files deployed
ls -la /var/www/bkss/

# 2. Check Nginx configuration
sudo nginx -t

# 3. Check Nginx logs
sudo tail -f /var/log/nginx/bkss_error.log

# 4. Check .env file
cat frontend/.env
```

**Solutions:**
```bash
# Rebuild and redeploy
cd frontend
npm run build
sudo cp -r dist/* /var/www/bkss/
sudo systemctl reload nginx

# Clear browser cache (Ctrl+Shift+R)
```

### Database Issues

**Problem:** Cannot connect to database

**Check:**
```bash
# 1. PostgreSQL running?
sudo systemctl status postgresql

# 2. Can connect locally?
PGPASSWORD='your_password' psql -U postgres -d bkss_db -h localhost

# 3. Check pg_hba.conf
sudo cat /etc/postgresql/14/main/pg_hba.conf | grep -v "^#"

# 4. Check backend .env
cat backend/.env | grep DB_
```

**Solutions:**
```bash
# Restart PostgreSQL
sudo systemctl restart postgresql

# Fix authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Ensure: host bkss_db postgres 127.0.0.1/32 md5

# Reload
sudo systemctl reload postgresql
```

### SSL/HTTPS Issues

**Problem:** SSL certificate errors

**Check:**
```bash
# 1. Certificate status
sudo certbot certificates

# 2. Renewal status
sudo certbot renew --dry-run

# 3. Nginx SSL config
sudo nano /etc/nginx/sites-available/bkss
```

**Solutions:**
```bash
# Renew certificate
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

### Performance Issues

**Problem:** Slow response times

**Optimize:**
```bash
# 1. Enable PM2 cluster mode (already done)
# 2. Increase PM2 instances
pm2 scale bkss-backend 4

# 3. Optimize database
PGPASSWORD='your_password' psql -U postgres -d bkss_db -c "VACUUM ANALYZE;"

# 4. Clear PM2 logs
pm2 flush

# 5. Optimize Nginx
sudo nano /etc/nginx/nginx.conf
# Increase: worker_processes auto;
# Increase: worker_connections 1024;

sudo systemctl reload nginx
```

---

## Deployment Checklist

Pre-deployment:
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] SSL certificate obtained
- [ ] Domain DNS configured

Deployment:
- [ ] Code pulled/uploaded to server
- [ ] Dependencies installed
- [ ] Database migrations run
- [ ] Backend deployed with PM2
- [ ] Frontend built and deployed
- [ ] Nginx configured
- [ ] SSL enabled
- [ ] Firewall configured

Post-deployment:
- [ ] Backend health check passing
- [ ] Frontend accessible
- [ ] Login working
- [ ] File uploads working
- [ ] All pages loading correctly
- [ ] API endpoints responding
- [ ] SSL certificate valid
- [ ] Monitoring set up
- [ ] Backups automated
- [ ] Default password changed

---

## Quick Reference

### Essential Commands

**Backend:**
```bash
pm2 status                       # Check status
pm2 logs bkss-backend           # View logs
pm2 restart bkss-backend        # Restart
pm2 reload bkss-backend         # Zero-downtime reload
```

**Frontend:**
```bash
npm run build                    # Build
sudo cp -r dist/* /var/www/bkss/ # Deploy
sudo systemctl reload nginx      # Reload Nginx
```

**Database:**
```bash
PGPASSWORD='password' psql -U postgres -d bkss_db -h localhost  # Connect
~/backup-database.sh             # Backup
```

**Services:**
```bash
sudo systemctl status nginx      # Nginx status
sudo systemctl status postgresql # PostgreSQL status
sudo systemctl restart nginx     # Restart Nginx
sudo nginx -t                    # Test config
```

---

## Support

**Documentation:**
- SETUP_GUIDE.md - Initial setup
- DEPLOYMENT_GUIDE.md - This file
- Feature .md files - Specific features

**Logs:**
- Backend: `pm2 logs bkss-backend`
- Nginx: `/var/log/nginx/bkss_*.log`
- PostgreSQL: `/var/log/postgresql/`

---

**Deployment Complete!** ✅

Your BKSS Platform is now running in production!

---

**Developer:** Rasmi Ranjan Senapati  
**Project:** BKSS Platform V1  
**Version:** 1.0.0  
**Environment:** Production  
**Last Updated:** 2024
