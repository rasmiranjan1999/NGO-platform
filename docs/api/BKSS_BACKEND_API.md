# BKSS Platform Backend API Documentation

## Base URL

```text
http://localhost:5000/api
```

---

# Authentication

## Login

### POST

```http
/api/auth/login
```

### Request

```json
{
  "email": "rasmi@admin.com",
  "password": "admin@123"
}
```

### Response

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "rasmi@admin.com",
    "role": "super_admin"
  }
}
```

---

# Admin Management

## Create Admin

### POST

```http
/api/admins
```

### Header

```text
Authorization: Bearer JWT_TOKEN
```

### Request

```json
{
  "name": "BKSS Admin",
  "email": "admin@bkss.org",
  "password": "admin123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "BKSS Admin",
    "email": "admin@bkss.org",
    "role": "admin"
  }
}
```

---

# Member Management

## Create Member

### POST

```http
/api/members
```

### Request

```json
{
  "name": "Rasmi Ranjan Senapati",
  "photo": "member.jpg",
  "mobile": "9876543210",
  "email": "rasmi@gmail.com",
  "address": "Balasore",
  "occupation": "Software Engineer",
  "qualification": "B.Tech"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "member_id": "MEM-20260617-0001"
  }
}
```

---

## Get Members

### GET

```http
/api/members
```

---

## Delete Member

### DELETE

```http
/api/members/:id
```

---

## Public Members

### GET

```http
/api/members/public
```

### Response

```json
[
  {
    "member_id": "MEM-20260617-0001",
    "name": "Rasmi Ranjan Senapati",
    "photo": "member.jpg"
  }
]
```

---

# Volunteer Management

## Apply Volunteer

### POST

```http
/api/volunteers/apply
```

### Request

```json
{
  "name": "Rahul Das",
  "mobile": "9876543210",
  "email": "rahul@gmail.com",
  "address": "Balasore",
  "education": "BCA",
  "occupation": "Student",
  "photo": "rahul.jpg",
  "reason": "Want to help society"
}
```

### Response

```json
{
  "success": true,
  "message": "Volunteer application submitted"
}
```

---

## Get Volunteers

### GET

```http
/api/volunteers
```

---

## Approve Volunteer

### PUT

```http
/api/volunteers/:id/approve
```

### Response

```json
{
  "success": true,
  "message": "Volunteer approved",
  "volunteer_id": "VOL-20260617-0001"
}
```

---

## Reject Volunteer

### PUT

```http
/api/volunteers/:id/reject
```

---

## Public Volunteers

### GET

```http
/api/volunteers/public
```

### Response

```json
[
  {
    "volunteer_id": "VOL-20260617-0001",
    "name": "Rahul Das",
    "photo": "rahul.jpg"
  }
]
```

---

# Activities

## Create Activity

### POST

```http
/api/activities
```

### Request

```json
{
  "title": "Blood Donation Camp 2025",
  "cover_image": "blood.jpg",
  "description": "Blood donation camp",
  "activity_date": "2025-08-15",
  "publish_status": true
}
```

---

## Get Activities

### GET

```http
/api/activities
```

---

## Get Activity

### GET

```http
/api/activities/:slug
```

---

## Update Activity

### PUT

```http
/api/activities/:id
```

---

## Delete Activity

### DELETE

```http
/api/activities/:id
```

---

# News

## Create News

### POST

```http
/api/news
```

### Request

```json
{
  "title": "Tree Plantation Drive",
  "cover_image": "tree.jpg",
  "description": "500 trees planted",
  "publish_status": true
}
```

---

## Get News

### GET

```http
/api/news
```

---

## Latest News

### GET

```http
/api/news/latest
```

---

## Get News By Slug

### GET

```http
/api/news/:slug
```

---

## Update News

### PUT

```http
/api/news/:id
```

---

## Delete News

### DELETE

```http
/api/news/:id
```

---

# Gallery

## Create Album

### POST

```http
/api/gallery/albums
```

### Request

```json
{
  "title": "Blood Donation Camp",
  "event_date": "2025-08-15"
}
```

---

## Get Albums

### GET

```http
/api/gallery/albums
```

---

## Get Album Details

### GET

```http
/api/gallery/albums/:id
```

---

## Add Image

### POST

```http
/api/gallery/images
```

### Request

```json
{
  "album_id": 1,
  "image": "blood1.jpg",
  "title": "Blood Donation Event"
}
```

---

## Recent Images

### GET

```http
/api/gallery/recent
```

---

## Delete Image

### DELETE

```http
/api/gallery/images/:id
```

---

# Team Management

## Create Team Member

### POST

```http
/api/team
```

### Request

```json
{
  "name": "Ganesh Mohalik",
  "designation": "President",
  "photo": "ganesh.jpg",
  "description": "President of BKSS",
  "display_order": 1
}
```

---

## Get Team

### GET

```http
/api/team
```

---

## Update Team Member

### PUT

```http
/api/team/:id
```

---

## Delete Team Member

### DELETE

```http
/api/team/:id
```

---

# Contact Messages

## Submit Contact Form

### POST

```http
/api/contact
```

### Request

```json
{
  "name": "Visitor",
  "mobile": "9876543210",
  "email": "visitor@gmail.com",
  "subject": "Information",
  "message": "Need information about BKSS"
}
```

---

## Get Messages

### GET

```http
/api/contact
```

---

## Mark Read

### PUT

```http
/api/contact/:id/read
```

---

## Delete Message

### DELETE

```http
/api/contact/:id
```

---

# Settings

## Get Settings

### GET

```http
/api/settings
```

---

## Update Settings

### PUT

```http
/api/settings
```

### Request

```json
{
  "ngo_name": "Baba Kshyameswar Swechha Sebi Sangathan",
  "phone": "9876543210",
  "email": "info@bkss.org",
  "history": "History",
  "vision": "Vision",
  "mission": "Mission",
  "address": "Balasore",
  "logo": "/uploads/logo.png",
  "favicon": "/uploads/favicon.ico",
  "facebook": "",
  "instagram": "",
  "youtube": "",
  "twitter": ""
}
```

---

# Dashboard

## Statistics

### GET

```http
/api/dashboard/stats
```

### Response

```json
{
  "success": true,
  "data": {
    "members": 0,
    "volunteers": 0,
    "pending_volunteers": 0,
    "activities": 0,
    "news": 0,
    "gallery_images": 0,
    "admins": 2
  }
}
```

---

# Roles

## Super Admin

```text
Full Access
Create Admin
Delete Admin
Manage Everything
```

## Admin

```text
Manage Members
Manage Volunteers
Manage Activities
Manage News
Manage Gallery
Manage Team
Manage Contact
Manage Settings
```

## Public User

```text
View Website
Apply Volunteer
Contact Form
View Activities
View News
View Gallery
View Team
View Members
View Volunteers
```
