# BKSS Platform - Complete Setup Guide 🚀

## Overview
This guide covers the complete setup process for the BKSS Platform, including all prerequisites, dependencies, and configuration.

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Environment Configuration](#environment-configuration)
7. [First Run](#first-run)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **OS:** Ubuntu 20.04+ / Debian 10+ / CentOS 8+ (Linux recommended)
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 10GB free space
- **CPU:** 2 cores minimum
- **Network:** Internet connection for package downloads

### Recommended Setup
- **OS:** Ubuntu 22.04 LTS
- **RAM:** 4GB or more
- **Storage:** 20GB SSD
- **CPU:** 4 cores
- **Domain:** Optional (for SSL/HTTPS)

---

## Prerequisites Installation

### 1. Node.js & npm

**Check if installed:**
```bash
node --version  # Should be v18+ or v20+
npm --version   # Should be v9+ or v10+
```

**Install on Ubuntu/Debian:**
```bash
# Update package list
sudo apt update

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Install on CentOS/RHEL:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### 2. PostgreSQL Database

**Check if installed:**
```bash
psql --version  # Should be v12+ or higher
```

**Install on Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify it's running
sudo systemctl status postgresql
```

**Install on CentOS/RHEL:**
```bash
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. PM2 Process Manager (Optional but Recommended)

**Install globally:**
```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### 4. Nginx Web Server (For Production)

**Install on Ubuntu/Debian:**
```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
```

**Install on CentOS/RHEL:**
```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Git (Version Control)

**Install:**
```bash
# Ubuntu/Debian
sudo apt install -y git

# CentOS/RHEL
sudo yum install -y git

# Verify
git --version
```

---

## Database Setup

### 1. Access PostgreSQL

**Switch to postgres user:**
```bash
sudo -u postgres psql
```

### 2. Create Database User

**Inside PostgreSQL prompt:**
```sql
-- Create user with password
CREATE USER postgres WITH PASSWORD 'postgres';

-- Grant privileges
ALTER USER postgres WITH SUPERUSER;

-- Exit
\q
```

### 3. Create Database

```bash
# Create database
sudo -u postgres createdb bkss_db

# Or from PostgreSQL prompt:
sudo -u postgres psql
CREATE DATABASE bkss_db;
\q
```

### 4. Configure PostgreSQL Authentication

**Edit pg_hba.conf:**
```bash
# Find the file
sudo find / -name pg_hba.conf 2>/dev/null

# Common locations:
# Ubuntu: /etc/postgresql/14/main/pg_hba.conf
# CentOS: /var/lib/pgsql/data/pg_hba.conf

# Edit the file
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

**Change this line:**
```
local   all             postgres                                peer
```

**To:**
```
local   all             postgres                                md5
```

**Restart PostgreSQL:**
```bash
sudo systemctl restart postgresql
```

### 5. Test Database Connection

```bash
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost -c "SELECT 1;"
```

Expected output: `1` (success)

### 6. Create Database Schema

**Run the schema file:**
```bash
cd ~/myprojects/BKSS/bkss-platform_V1
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost -f backend/schema.sql
```

**If schema.sql doesn't exist, create tables manually:**
```sql
-- Connect to database
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost

-- Create tables (run these commands)
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    ngo_name VARCHAR(255),
    registration_number VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    map_location TEXT,
    history TEXT,
    vision TEXT,
    mission TEXT,
    logo TEXT,
    favicon TEXT,
    president_photo TEXT,
    president_message TEXT,
    secretary_photo TEXT,
    secretary_message TEXT,
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo TEXT,
    mobile VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    occupation VARCHAR(255),
    qualification VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    skills TEXT,
    experience TEXT,
    why_join TEXT,
    availability VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    cover_image TEXT,
    activity_date DATE,
    location VARCHAR(255),
    organizer VARCHAR(255),
    status VARCHAR(50) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT,
    image TEXT,
    author VARCHAR(255),
    published_date DATE,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    photo TEXT,
    bio TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (Super Admin)
INSERT INTO admins (name, email, password, role)
VALUES (
    'Super Admin',
    'rasmi@admin.com',
    '$2a$10$YourHashedPasswordHere',  -- Password: admin@123 (will be hashed)
    'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert default settings row
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Exit
\q
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/backend
```

### 2. Install Dependencies

```bash
npm install
```

**Expected packages installed:**
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables
- `helmet` - Security headers
- `morgan` - HTTP logging
- `multer` - File upload handling
- `nodemon` - Development auto-restart (dev only)

### 3. Create Environment File

```bash
cp .env.example .env
# Or create new file:
nano .env
```

**Add configuration:**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bkss_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret (CHANGE THIS!)
JWT_SECRET=change_this_to_a_long_random_secret_string_123!
```

**Generate secure JWT secret:**
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use as JWT_SECRET.

### 4. Create Uploads Directory

```bash
mkdir -p uploads
chmod 755 uploads
```

### 5. Test Backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

**Expected output:**
```
Server running on port 5000
Database connected successfully
```

**Test API:**
```bash
curl http://localhost:5000/
```

Expected: `{"success":true,"message":"BKSS Backend Running","version":"1.0.0"}`

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/frontend
```

### 2. Install Dependencies

```bash
npm install
```

**Expected packages installed:**
- `react` - React framework
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-icons` - Icon library
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS post-processor
- `postcss` - CSS transformer
- `@vitejs/plugin-react` - Vite React plugin

### 3. Create Environment File

```bash
nano .env
```

**For Development:**
```env
VITE_API_BASE_URL=http://localhost:5000
```

**For Production:**
```env
VITE_API_BASE_URL=https://your-domain.com
```

### 4. Build Frontend

```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build
```

**Expected output for build:**
```
✓ 138 modules transformed.
dist/index.html                   1.04 kB
dist/assets/index-xxxxx.css       97.14 kB
dist/assets/index-xxxxx.js        774.53 kB
✓ built in 40s
```

### 5. Test Frontend

**Development:**
```bash
npm run dev
```
Visit: http://localhost:3000

**Production Preview:**
```bash
npm run preview
```

---

## Environment Configuration

### Backend Environment Variables

**File:** `backend/.env`

```env
# ============================================
# Server Configuration
# ============================================
PORT=5000
NODE_ENV=production

# ============================================
# Database Configuration
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bkss_db
DB_USER=postgres
DB_PASSWORD=your_secure_password_here

# ============================================
# Security
# ============================================
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_long_random_jwt_secret_here_minimum_32_characters

# ============================================
# File Upload Configuration
# ============================================
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800  # 50MB in bytes
```

### Frontend Environment Variables

**File:** `frontend/.env`

```env
# ============================================
# API Configuration
# ============================================
# Development
VITE_API_BASE_URL=http://localhost:5000

# Production (update with your domain)
# VITE_API_BASE_URL=https://your-domain.com

# No trailing slash, no /api suffix
```

---

## First Run

### 1. Start Backend

```bash
cd ~/myprojects/BKSS/bkss-platform_V1/backend

# Using PM2 (recommended for production)
pm2 start src/server.js --name bkss-backend

# Or using npm
npm start
```

### 2. Start Frontend

**Development:**
```bash
cd ~/myprojects/BKSS/bkss-platform_V1/frontend
npm run dev
```

**Production:**
```bash
# Build first
npm run build

# Serve with Nginx (see DEPLOYMENT_GUIDE.md)
```

### 3. Access Application

**Frontend:**
- Development: http://localhost:3000
- Production: https://your-domain.com

**Backend API:**
- Local: http://localhost:5000
- Production: https://your-domain.com/api

### 4. Default Login Credentials

**Super Admin:**
- Email: `rasmi@admin.com`
- Password: `admin@123`

**⚠️ IMPORTANT:** Change default password after first login!

---

## Verification

### Check All Services

```bash
# 1. PostgreSQL
sudo systemctl status postgresql

# 2. Backend (if using PM2)
pm2 status

# 3. Nginx (if installed)
sudo systemctl status nginx

# 4. Backend health
curl http://localhost:5000/

# 5. Database connection
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost -c "SELECT COUNT(*) FROM admins;"
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/

# Settings (public)
curl http://localhost:5000/api/settings

# Login (should work)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rasmi@admin.com","password":"admin@123"}'
```

### Test Frontend

1. Visit frontend URL
2. Homepage should load
3. Try navigation links
4. Test login page
5. Login with default credentials

---

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL

**Solutions:**
```bash
# 1. Check if PostgreSQL is running
sudo systemctl status postgresql

# 2. Check authentication method
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Ensure: local all postgres md5

# 3. Restart PostgreSQL
sudo systemctl restart postgresql

# 4. Test connection
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost
```

### Port Already in Use

**Problem:** Port 5000 or 3000 already in use

**Solutions:**
```bash
# Find process using port
sudo lsof -i :5000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in .env files
```

### npm Install Fails

**Problem:** npm install errors

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, update npm
sudo npm install -g npm@latest
```

### Permission Denied Errors

**Problem:** EACCES errors during npm install

**Solutions:**
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/myprojects

# Or install as user (not root)
npm install --unsafe-perm
```

### Backend Not Starting

**Problem:** Backend crashes on start

**Check:**
```bash
# 1. View logs
pm2 logs bkss-backend

# 2. Check .env file exists
ls -la backend/.env

# 3. Check database connection
# 4. Check all dependencies installed
cd backend && npm list

# 5. Try running directly
cd backend && node src/server.js
```

### Frontend Build Fails

**Problem:** npm run build fails

**Solutions:**
```bash
# 1. Check Node.js version
node --version  # Should be v18+

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Try build again
npm run build
```

---

## Directory Structure

```
bkss-platform_V1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── schema.sql
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── Documentation files (.md)
```

---

## Next Steps

After successful setup:

1. **Security:** Change default admin password
2. **Configuration:** Update NGO details in Settings
3. **Content:** Add members, activities, news
4. **Branding:** Upload logo and favicon
5. **Deployment:** Follow DEPLOYMENT_GUIDE.md for production setup
6. **Backup:** Set up regular database backups
7. **Monitoring:** Configure PM2 monitoring
8. **SSL:** Set up HTTPS with Let's Encrypt

---

## Support & Resources

### Documentation
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `SETUP_GUIDE.md` - This file
- Feature-specific .md files in root directory

### Useful Commands
```bash
# Backend
pm2 status                    # Check backend status
pm2 logs bkss-backend        # View backend logs
pm2 restart bkss-backend     # Restart backend

# Database
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost
# Access database

# Frontend
npm run dev                   # Development mode
npm run build                 # Production build

# System
sudo systemctl status postgresql   # PostgreSQL status
sudo systemctl status nginx        # Nginx status
```

---

## Checklist

Setup completion checklist:

- [ ] Node.js installed (v18+)
- [ ] PostgreSQL installed and running
- [ ] Database created (bkss_db)
- [ ] Database schema loaded
- [ ] Default admin created
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Backend starts successfully
- [ ] Frontend dependencies installed
- [ ] Frontend .env configured
- [ ] Frontend builds successfully
- [ ] Can access frontend
- [ ] Can login as admin
- [ ] All API endpoints working

---

**Setup Complete!** ✅

For production deployment, proceed to **DEPLOYMENT_GUIDE.md**

---

**Developer:** Rasmi Ranjan Senapati  
**Project:** BKSS Platform V1  
**Version:** 1.0.0  
**Last Updated:** 2024
