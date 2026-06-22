# BKSS Platform - Documentation Index 📚

## Overview
Complete documentation for the BKSS Platform including setup, deployment, and feature guides.

---

## 🚀 Getting Started

### 1. **SETUP_GUIDE.md** - Initial Setup
**Purpose:** Complete setup from scratch  
**For:** New installations, development environment  
**Covers:**
- System requirements
- Prerequisites installation (Node.js, PostgreSQL, PM2, Nginx)
- Database setup and schema
- Backend configuration
- Frontend configuration
- Environment variables
- First run and testing
- Troubleshooting

**Start here if:** You're setting up the platform for the first time

---

### 2. **DEPLOYMENT_GUIDE.md** - Production Deployment
**Purpose:** Deploy to production server  
**For:** Production environment, live website  
**Covers:**
- Server preparation
- Backend deployment with PM2
- Frontend deployment with Nginx
- SSL/HTTPS setup with Let's Encrypt
- Security hardening
- Monitoring and logging
- Backup strategies
- Updates and maintenance
- Zero-downtime deployment

**Start here if:** You've completed setup and ready to go live

---

## 🎯 Feature Documentation

### Core Features

**3. DYNAMIC_MAP_LOCATION_FEATURE.md**
- Dynamic Google Maps integration
- Admin/Super Admin can update location
- Shows on Contact and Home pages
- Database schema details
- Complete implementation guide

**4. CLICKABLE_MAP_IMPLEMENTATION.md**
- Clickable map cards
- Opens Google Maps directly
- Mobile app integration
- Design specifications

**5. HOME_MAP_CARD_UPDATE.md**
- Small map card on homepage
- Matches contact info style
- Purple gradient design
- Admin access for both roles

### UI Improvements

**6. THANK_YOU_PAGE_IMPLEMENTATION.md**
- Thank you page after form submissions
- Dynamic content based on source
- Auto-redirect functionality

**7. FOOTER_SIZE_MINIMIZED.md**
- Compact footer design
- Contact information display

**8. FOOTER_DYNAMIC_COPYRIGHT_DEVELOPER_CREDIT.md**
- Dynamic NGO name in footer
- Developer credit display

**9. FAVICON_DYNAMIC_UPDATE_FIX.md**
- Browser favicon updates
- Cache-busting implementation

### Admin Features

**10. MEMBERS_PAGE_FIX.md**
- Public members endpoint
- Profile modal implementation
- Search and filter features

**11. ADMIN_QUICK_REFERENCE.md**
- Admin panel features
- Quick command reference

**12. ADMIN_PANEL_SHOWCASE.md**
- Admin capabilities overview

### Fixes & Updates

**13. UPLOAD_ERROR_413_FIX.md**
- 50MB upload limit configuration
- Nginx and backend settings

**14. DEPLOYMENT_FIX_GUIDE.md**
- Backend connection fixes
- SSL configuration

**15. DROPDOWN_FIX_FINAL.md**
- Navigation dropdown fixes

---

## 📦 Package Information

### Backend Dependencies

**Production:**
- `express` (v4.19.2) - Web framework
- `pg` (v8.21.0) - PostgreSQL client
- `bcryptjs` (v3.0.3) - Password hashing
- `jsonwebtoken` (v9.0.3) - JWT authentication
- `cors` (v2.8.5) - Cross-Origin Resource Sharing
- `dotenv` (v16.4.5) - Environment variables
- `helmet` (v8.2.0) - Security headers
- `morgan` (v1.11.0) - HTTP request logging
- `multer` (v1.4.5) - File upload handling

**Development:**
- `nodemon` (v3.1.0) - Auto-restart during development

### Frontend Dependencies

**Production:**
- `react` (v18.3.1) - UI library
- `react-dom` (v18.3.1) - React DOM rendering
- `react-router-dom` (v6.30.4) - Routing
- `axios` (v1.18.0) - HTTP client
- `react-icons` (v5.6.0) - Icon components

**Development:**
- `vite` (v5.2.11) - Build tool
- `@vitejs/plugin-react` (v4.3.0) - Vite React support
- `tailwindcss` (v3.4.19) - CSS framework
- `autoprefixer` (v10.5.0) - CSS post-processing
- `postcss` (v8.5.15) - CSS transformations

---

## 🔧 Quick Reference

### Essential Commands

**Backend:**
```bash
cd backend
npm install              # Install dependencies
npm run dev              # Development mode
npm start                # Production mode
pm2 start ecosystem.config.js  # PM2 deployment
pm2 logs bkss-backend   # View logs
pm2 restart bkss-backend # Restart
```

**Frontend:**
```bash
cd frontend
npm install              # Install dependencies
npm run dev              # Development mode (port 3000)
npm run build            # Build for production
sudo cp -r dist/* /var/www/bkss/  # Deploy
```

**Database:**
```bash
# Connect
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost

# Backup
~/backup-database.sh

# Migrations
./update-database-map-location.sh
```

**Services:**
```bash
sudo systemctl status nginx       # Nginx status
sudo systemctl status postgresql  # Database status
sudo systemctl reload nginx       # Reload Nginx
sudo nginx -t                     # Test Nginx config
```

---

## 🌍 Environments

### Development
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Database:** localhost:5432
- **Hot reload:** Enabled

### Production
- **Frontend:** https://your-domain.com
- **Backend:** https://your-domain.com/api
- **SSL:** Enabled
- **PM2:** Cluster mode

---

## 📂 Directory Structure

```
bkss-platform_V1/
│
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Middleware functions
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server entry point
│   ├── uploads/             # Uploaded files
│   ├── logs/                # Application logs
│   ├── .env                 # Environment variables
│   ├── package.json         # Dependencies
│   └── ecosystem.config.js  # PM2 configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── super-admin/ # Super admin pages
│   │   │   └── public/      # Public pages
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static files
│   ├── dist/                # Production build
│   ├── .env                 # Environment variables
│   ├── package.json         # Dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind configuration
│
└── Documentation/           # All .md files
    ├── SETUP_GUIDE.md       ⭐ Start here for setup
    ├── DEPLOYMENT_GUIDE.md  ⭐ Start here for deployment
    └── [Feature docs...]    # Specific features
```

---

## 🎓 Learning Path

### For New Developers

1. **Read SETUP_GUIDE.md**
   - Understand system architecture
   - Install prerequisites
   - Set up development environment

2. **Explore codebase**
   - Backend: Express.js + PostgreSQL
   - Frontend: React + Vite + Tailwind CSS
   - Review directory structure

3. **Run locally**
   - Start backend with `npm run dev`
   - Start frontend with `npm run dev`
   - Test all features

4. **Read feature docs**
   - Understand implemented features
   - See how features work together

### For DevOps/Deployment

1. **Complete setup** (SETUP_GUIDE.md)
2. **Follow deployment** (DEPLOYMENT_GUIDE.md)
3. **Configure monitoring**
4. **Set up backups**
5. **Implement security hardening**

### For Maintenance

1. **Know the commands** (Quick Reference above)
2. **Monitor logs** (PM2, Nginx, PostgreSQL)
3. **Regular backups** (Database + files)
4. **Update dependencies** (npm update)
5. **SSL renewal** (Certbot auto-renews)

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (64+ characters)
- [ ] Use strong database password
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall (UFW)
- [ ] Set proper file permissions
- [ ] Enable PM2 monitoring
- [ ] Set up automated backups
- [ ] Keep dependencies updated
- [ ] Review Nginx security headers
- [ ] Limit PostgreSQL access to localhost

---

## 📊 Monitoring Checklist

- [ ] PM2 status dashboard (`pm2 monit`)
- [ ] Backend logs (`pm2 logs bkss-backend`)
- [ ] Nginx access logs
- [ ] Nginx error logs
- [ ] PostgreSQL logs
- [ ] Disk space (`df -h`)
- [ ] Memory usage (`free -h`)
- [ ] SSL certificate expiry
- [ ] Backup completion
- [ ] Application uptime

---

## 🆘 Getting Help

### Documentation
Start with the relevant .md file based on your need:
- Setup → SETUP_GUIDE.md
- Deployment → DEPLOYMENT_GUIDE.md
- Features → Specific feature .md files

### Logs
Check logs for errors:
```bash
pm2 logs bkss-backend --lines 100
sudo tail -f /var/log/nginx/bkss_error.log
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Common Issues
See "Troubleshooting" sections in:
- SETUP_GUIDE.md
- DEPLOYMENT_GUIDE.md

### Verification
Test all components:
```bash
# Backend
curl http://localhost:5000/

# Database
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost -c "SELECT 1;"

# Nginx
sudo nginx -t

# PM2
pm2 status
```

---

## 📝 Update Log

**Latest Updates:**
- ✅ Dynamic Google Maps location
- ✅ Clickable map cards
- ✅ Admin settings for map location
- ✅ Home page map card redesign
- ✅ Complete setup guide
- ✅ Complete deployment guide

**Version:** 1.0.0  
**Last Updated:** 2024

---

## 🎯 Quick Start (New Installation)

**In 5 steps:**

1. **Prerequisites**
   ```bash
   # Install Node.js, PostgreSQL, PM2, Nginx
   # See SETUP_GUIDE.md Section: Prerequisites Installation
   ```

2. **Clone & Install**
   ```bash
   git clone <repo> bkss-platform_V1
   cd bkss-platform_V1/backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure**
   ```bash
   # Set up database (see SETUP_GUIDE.md)
   # Configure backend/.env
   # Configure frontend/.env
   ```

4. **Run**
   ```bash
   # Backend: pm2 start backend/ecosystem.config.js
   # Frontend: npm run dev (or deploy to Nginx)
   ```

5. **Access**
   ```
   https://your-domain.com
   Login: rasmi@admin.com / admin@123
   ```

---

## 📌 Important Notes

**Default Credentials:**
- Email: rasmi@admin.com
- Password: admin@123
- ⚠️ **CHANGE IMMEDIATELY AFTER FIRST LOGIN!**

**Port Configuration:**
- Backend: 5000
- Frontend (dev): 3000
- PostgreSQL: 5432
- Nginx: 80, 443

**File Limits:**
- Max upload size: 50MB
- Configured in Nginx and backend

**SSL Certificate:**
- Auto-renews via Certbot
- Check: `sudo certbot certificates`

---

## ✅ Status

**Platform:** Production Ready  
**Documentation:** Complete  
**Last Reviewed:** 2024  
**Maintained By:** Rasmi Ranjan Senapati

---

**Need help?** Start with SETUP_GUIDE.md or DEPLOYMENT_GUIDE.md! 🚀
