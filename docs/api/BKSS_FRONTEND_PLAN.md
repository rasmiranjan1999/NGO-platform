# BKSS Frontend Development Plan

## Tech Stack

* React
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Context API

---

# Frontend Structure

```text
src
│
├── app
│
├── components
│   ├── admin
│   ├── public
│   ├── shared
│   └── superadmin
│
├── layouts
│   ├── PublicLayout.jsx
│   ├── AdminLayout.jsx
│   └── SuperAdminLayout.jsx
│
├── pages
│   ├── public
│   ├── admin
│   └── super-admin
│
├── routes
│
├── services
│
├── context
│
├── hooks
│
├── constants
│
└── utils
```

---

# Public Pages

## Home

Route:

```text
/
```

API:

```text
GET /api/settings
GET /api/news/latest
GET /api/activities
GET /api/gallery/recent
GET /api/team
```

Sections:

```text
Hero
NGO Intro
Latest Activities
Latest News
Recent Gallery
President Message
Secretary Message
Statistics
Contact
```

---

## About

```text
/about
```

API:

```text
GET /api/settings
```

Show:

```text
History
Vision
Mission
```

---

## Activities

```text
/activities
```

API:

```text
GET /api/activities
```

---

## Activity Details

```text
/activities/:slug
```

API:

```text
GET /api/activities/:slug
```

---

## News

```text
/news
```

API:

```text
GET /api/news
```

---

## News Details

```text
/news/:slug
```

API:

```text
GET /api/news/:slug
```

---

## Gallery

```text
/gallery
```

API:

```text
GET /api/gallery/albums
```

---

## Album Details

```text
/gallery/:id
```

API:

```text
GET /api/gallery/albums/:id
```

---

## Team

```text
/team
```

API:

```text
GET /api/team
```

---

## Members

```text
/members
```

API:

```text
GET /api/members/public
```

---

## Volunteers

```text
/volunteers
```

API:

```text
GET /api/volunteers/public
```

---

## Contact

```text
/contact
```

API:

```text
POST /api/contact
```

---

## Volunteer Apply

```text
/volunteer-apply
```

API:

```text
POST /api/volunteers/apply
```

---

# Authentication

## Login

```text
/login
```

API:

```text
POST /api/auth/login
```

Logic:

```text
super_admin
      ↓
/super-admin/dashboard

admin
      ↓
/admin/dashboard
```

---

# Admin Dashboard

## Dashboard

```text
/admin/dashboard
```

API:

```text
GET /api/dashboard/stats
```

Cards:

```text
Members
Volunteers
Pending Requests
Activities
News
Gallery Images
```

---

## Admin Pages

```text
/admin/members
/admin/volunteers
/admin/activities
/admin/news
/admin/gallery
/admin/team
/admin/contact
/admin/settings
```

---

# Super Admin Dashboard

## Dashboard

```text
/super-admin/dashboard
```

API:

```text
GET /api/dashboard/stats
```

---

## Super Admin Pages

```text
/super-admin/admins
/super-admin/members
/super-admin/volunteers
/super-admin/activities
/super-admin/news
/super-admin/gallery
/super-admin/team
/super-admin/contact
/super-admin/settings
```

---

## Additional Access

```text
Create Admin
Delete Admin
Reset Password
```

---

# Phase Order

## Phase 1

```text
Auth Context
Login Page
Protected Routes
Role Based Routing
```

## Phase 2

```text
Layouts
Navbar
Sidebar
Footer
```

## Phase 3

```text
Dashboard Pages
```

## Phase 4

```text
CRUD Screens
```

## Phase 5

```text
Public Website
```

## Phase 6

```text
Image Upload Integration
```

## Phase 7

```text
Deployment
Oracle VPS
Nginx
PM2
SSL
```
