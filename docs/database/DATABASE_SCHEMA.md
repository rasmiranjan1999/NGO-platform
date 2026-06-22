# BKSS Platform - Database Schema Documentation 🗄️

## Overview
Complete database schema documentation for the BKSS Platform including all tables, columns, data types, constraints, relationships, and sample data.

---

## Table of Contents
1. [Database Information](#database-information)
2. [Tables Overview](#tables-overview)
3. [Table Details](#table-details)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Sample Data](#sample-data)
7. [SQL Scripts](#sql-scripts)
8. [Backup & Restore](#backup--restore)

---

## Database Information

**Database Name:** `bkss_db`  
**Database Engine:** PostgreSQL 12+  
**Character Set:** UTF-8  
**Total Tables:** 10  
**Environment:** Production

### Connection Details
```bash
Host: localhost
Port: 5432
Database: bkss_db
User: postgres
Password: [configured in .env]
```

---

## Tables Overview

| # | Table Name | Purpose | Records (Typical) |
|---|------------|---------|-------------------|
| 1 | users | Admin and Super Admin accounts | 5-20 |
| 2 | settings | NGO configuration and branding | 1 (singleton) |
| 3 | members | Registered NGO members | 50-500+ |
| 4 | volunteers | Volunteer applications | 20-200+ |
| 5 | activities | NGO activities and events | 10-100+ |
| 6 | news | News articles and updates | 10-100+ |
| 7 | albums | Gallery albums/categories | 5-20 |
| 8 | gallery_images | Images in gallery albums | 50-500+ |
| 9 | team_members | Leadership team members | 5-15 |
| 10 | contact_messages | Contact form submissions | 50-1000+ |

---

## Table Details

### 1. users Table

**Purpose:** Store admin and super admin user accounts

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | NO | AUTO | Primary key |
| name | VARCHAR(150) | NO | - | Admin full name |
| email | VARCHAR(150) | NO | - | Login email (unique) |
| password | TEXT | NO | - | Hashed password (bcrypt) |
| role | VARCHAR(30) | NO | 'admin' | Role: 'admin' or 'super_admin' |
| is_active | BOOLEAN | YES | true | Account status |
| created_at | TIMESTAMP | YES | NOW() | Account creation date |

**Constraints:**
- PRIMARY KEY: `id`
- UNIQUE: `email`

**Indexes:**
- `users_pkey` on `id`
- `users_email_key` on `email`

**Sample Data:**
```sql
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'rasmi@admin.com', '$2a$10$[hashed_password]', 'super_admin'),
('Admin User', 'admin@example.com', '$2a$10$[hashed_password]', 'admin');
```

---

### 2. settings Table

**Purpose:** Store NGO configuration, branding, and contact information (singleton table)

```sql
CREATE TABLE settings (
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
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INTEGER | NO | Always 1 (singleton) |
| ngo_name | VARCHAR(255) | YES | Organization name |
| registration_number | VARCHAR(100) | YES | Official registration number |
| phone | VARCHAR(20) | YES | Contact phone number |
| email | VARCHAR(255) | YES | Contact email address |
| address | TEXT | YES | Physical address |
| map_location | TEXT | YES | Google Maps share link |
| history | TEXT | YES | Organization history |
| vision | TEXT | YES | Vision statement |
| mission | TEXT | YES | Mission statement |
| logo | TEXT | YES | Logo file path |
| favicon | TEXT | YES | Favicon file path |
| president_photo | TEXT | YES | President photo path |
| president_message | TEXT | YES | President message |
| secretary_photo | TEXT | YES | Secretary photo path |
| secretary_message | TEXT | YES | Secretary message |
| facebook | VARCHAR(255) | YES | Facebook URL |
| instagram | VARCHAR(255) | YES | Instagram URL |
| youtube | VARCHAR(255) | YES | YouTube URL |
| twitter | VARCHAR(255) | YES | Twitter URL |
| linkedin | VARCHAR(255) | YES | LinkedIn URL |
| created_at | TIMESTAMP | YES | Creation timestamp |
| updated_at | TIMESTAMP | YES | Last update timestamp |

**Constraints:**
- PRIMARY KEY: `id`
- CHECK: `id = 1` (ensures singleton)

**Sample Data:**
```sql
INSERT INTO settings (id, ngo_name, email, phone) VALUES
(1, 'BKSS Foundation', 'info@bkss.org', '+91 1234567890');
```

---
### 3. members Table

**Purpose:** Store registered NGO members information

```sql
CREATE TABLE members (
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
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | SERIAL | NO | Primary key |
| member_id | VARCHAR(50) | NO | Unique member ID (e.g., BKSS-001) |
| name | VARCHAR(255) | NO | Member full name |
| photo | TEXT | YES | Photo file path |
| mobile | VARCHAR(20) | YES | Contact number |
| email | VARCHAR(255) | YES | Email address |
| address | TEXT | YES | Residential address |
| occupation | VARCHAR(255) | YES | Profession/occupation |
| qualification | VARCHAR(255) | YES | Educational qualification |
| created_at | TIMESTAMP | YES | Registration date |

**Constraints:**
- PRIMARY KEY: `id`
- UNIQUE: `member_id`

**Sample Data:**
```sql
INSERT INTO members (member_id, name, mobile, email, occupation, qualification) VALUES
('BKSS-001', 'John Doe', '+91 9876543210', 'john@example.com', 'Engineer', 'B.Tech'),
('BKSS-002', 'Jane Smith', '+91 9876543211', 'jane@example.com', 'Teacher', 'M.Ed');
```

---
### 4. volunteers Table

**Purpose:** Store volunteer applications and status

```sql
CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    skills TEXT,
    interest TEXT,
    available_hours VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | NO | AUTO | Primary key |
| name | VARCHAR(150) | NO | - | Volunteer name |
| email | VARCHAR(150) | YES | - | Contact email |
| phone | VARCHAR(20) | YES | - | Contact phone |
| address | TEXT | YES | - | Address |
| skills | TEXT | YES | - | Skills/expertise |
| interest | TEXT | YES | - | Areas of interest |
| available_hours | VARCHAR(100) | YES | - | Availability |
| status | VARCHAR(30) | YES | 'pending' | Status: pending/approved/rejected |
| approved_by | INTEGER | YES | - | Admin who approved (FK to users) |
| approved_at | TIMESTAMP | YES | - | Approval timestamp |
| created_at | TIMESTAMP | YES | NOW() | Application date |

**Constraints:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `approved_by` → `users(id)`

**Sample Data:**
```sql
INSERT INTO volunteers (name, email, phone, skills, interest, status) VALUES
('Alice Johnson', 'alice@example.com', '+91 9876543212', 'Teaching, Event Management', 'Education', 'approved'),
('Bob Wilson', 'bob@example.com', '+91 9876543213', 'Medical', 'Healthcare', 'pending');
```

---
### 5. activities Table

**Purpose:** Store NGO activities, events, and programs

```sql
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    cover_image TEXT,
    activity_date DATE,
    location VARCHAR(255),
    organizer VARCHAR(255),
    participants_count INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'upcoming',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | NO | AUTO | Primary key |
| title | VARCHAR(255) | NO | - | Activity title |
| slug | VARCHAR(255) | YES | - | URL-friendly slug |
| description | TEXT | YES | - | Activity details |
| cover_image | TEXT | YES | - | Cover image path |
| activity_date | DATE | YES | - | Event date |
| location | VARCHAR(255) | YES | - | Event location |
| organizer | VARCHAR(255) | YES | - | Organizer name |
| participants_count | INTEGER | YES | 0 | Number of participants |
| status | VARCHAR(30) | YES | 'upcoming' | Status: upcoming/ongoing/completed |
| created_by | INTEGER | YES | - | Admin who created (FK) |
| created_at | TIMESTAMP | YES | NOW() | Creation date |
| updated_at | TIMESTAMP | YES | NOW() | Last update date |

**Constraints:**
- PRIMARY KEY: `id`
- UNIQUE: `slug`
- FOREIGN KEY: `created_by` → `users(id)`

**Sample Data:**
```sql
INSERT INTO activities (title, slug, description, activity_date, location, status) VALUES
('Medical Camp 2024', 'medical-camp-2024', 'Free medical checkup for villagers', '2024-06-15', 'Village Center', 'completed'),
('Education Seminar', 'education-seminar', 'Career guidance for students', '2024-07-20', 'Community Hall', 'upcoming');
```

---
### 6. news Table

**Purpose:** Store news articles and updates

```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT,
    excerpt TEXT,
    image TEXT,
    author VARCHAR(255),
    published_date DATE,
    status VARCHAR(30) DEFAULT 'draft',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | NO | AUTO | Primary key |
| title | VARCHAR(255) | NO | - | News title |
| slug | VARCHAR(255) | YES | - | URL slug |
| content | TEXT | YES | - | Full article content |
| excerpt | TEXT | YES | - | Short summary |
| image | TEXT | YES | - | Featured image path |
| author | VARCHAR(255) | YES | - | Author name |
| published_date | DATE | YES | - | Publication date |
| status | VARCHAR(30) | YES | 'draft' | Status: draft/published |
| created_by | INTEGER | YES | - | Admin who created |
| created_at | TIMESTAMP | YES | NOW() | Creation timestamp |
| updated_at | TIMESTAMP | YES | NOW() | Update timestamp |

**Constraints:**
- PRIMARY KEY: `id`
- UNIQUE: `slug`
- FOREIGN KEY: `created_by` → `users(id)`

**Sample Data:**
```sql
INSERT INTO news (title, slug, content, author, published_date, status) VALUES
('New Initiative Launch', 'new-initiative-launch', 'We are launching...', 'Admin', '2024-06-01', 'published'),
('Annual Report 2024', 'annual-report-2024', 'Our achievements...', 'Admin', '2024-05-15', 'published');
```

---
### 7. albums Table

**Purpose:** Organize gallery images into albums/categories

```sql
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE,
    description TEXT,
    cover_image TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | SERIAL | NO | Primary key |
| name | VARCHAR(150) | NO | Album name |
| slug | VARCHAR(150) | YES | URL slug |
| description | TEXT | YES | Album description |
| cover_image | TEXT | YES | Album cover image |
| created_by | INTEGER | YES | Creator admin ID |
| created_at | TIMESTAMP | YES | Creation date |

**Constraints:**
- PRIMARY KEY: `id`
- UNIQUE: `slug`
- FOREIGN KEY: `created_by` → `users(id)`

**Sample Data:**
```sql
INSERT INTO albums (name, slug, description) VALUES
('Events 2024', 'events-2024', 'All events from 2024'),
('Medical Camps', 'medical-camps', 'Medical camp photos'),
('Community Service', 'community-service', 'Community service activities');
```

---

### 8. gallery_images Table

**Purpose:** Store gallery images with album associations

```sql
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    image_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | NO | AUTO | Primary key |
| album_id | INTEGER | YES | - | Album ID (FK) |
| title | VARCHAR(255) | YES | - | Image title |
| description | TEXT | YES | - | Image description |
| image_path | TEXT | NO | - | File path |
| display_order | INTEGER | YES | 0 | Sort order |
| uploaded_by | INTEGER | YES | - | Uploader admin ID |
| created_at | TIMESTAMP | YES | NOW() | Upload date |

**Constraints:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `album_id` → `albums(id)` ON DELETE CASCADE
- FOREIGN KEY: `uploaded_by` → `users(id)`

**Sample Data:**
```sql
INSERT INTO gallery_images (album_id, title, image_path, display_order) VALUES
(1, 'Annual Function', '/uploads/gallery/event1.jpg', 1),
(1, 'Prize Distribution', '/uploads/gallery/event2.jpg', 2),
(2, 'Medical Camp Day 1', '/uploads/gallery/medical1.jpg', 1);
```

---

### 9. team_members Table

**Purpose:** Store leadership team member information

```sql
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    photo TEXT,
    bio TEXT,
    email VARCHAR(150),
    phone VARCHAR(20),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | NO | AUTO | Primary key |
| name | VARCHAR(150) | NO | - | Member name |
| position | VARCHAR(150) | NO | - | Position/title |
| photo | TEXT | YES | - | Photo path |
| bio | TEXT | YES | - | Biography |
| email | VARCHAR(150) | YES | - | Contact email |
| phone | VARCHAR(20) | YES | - | Contact phone |
| display_order | INTEGER | YES | 0 | Display order |
| is_active | BOOLEAN | YES | true | Active status |
| created_at | TIMESTAMP | YES | NOW() | Creation date |

**Constraints:**
- PRIMARY KEY: `id`

**Sample Data:**
```sql
INSERT INTO team_members (name, position, email, phone, display_order) VALUES
('Dr. Rajesh Kumar', 'President', 'president@bkss.org', '+91 9876543214', 1),
('Mrs. Priya Sharma', 'Secretary', 'secretary@bkss.org', '+91 9876543215', 2),
('Mr. Amit Patel', 'Treasurer', 'treasurer@bkss.org', '+91 9876543216', 3);
```

---

### 10. contact_messages Table

**Purpose:** Store contact form submissions

```sql
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'unread',
    replied_by INTEGER REFERENCES users(id),
    reply_message TEXT,
    replied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | NO | AUTO | Primary key |
| name | VARCHAR(150) | NO | - | Sender name |
| email | VARCHAR(150) | NO | - | Sender email |
| phone | VARCHAR(20) | YES | - | Sender phone |
| subject | VARCHAR(255) | YES | - | Message subject |
| message | TEXT | NO | - | Message content |
| status | VARCHAR(30) | YES | 'unread' | Status: unread/read/replied |
| replied_by | INTEGER | YES | - | Admin who replied |
| reply_message | TEXT | YES | - | Reply content |
| replied_at | TIMESTAMP | YES | - | Reply timestamp |
| created_at | TIMESTAMP | YES | NOW() | Submission date |

**Constraints:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `replied_by` → `users(id)`

**Sample Data:**
```sql
INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('Rahul Singh', 'rahul@example.com', 'Volunteer Inquiry', 'I would like to volunteer...', 'read'),
('Sneha Gupta', 'sneha@example.com', 'Donation Query', 'How can I donate?', 'unread');
```

---

## Relationships

### Entity Relationship Diagram (ERD)

```
users (1) ──────┬─── (N) volunteers [approved_by]
                ├─── (N) activities [created_by]
                ├─── (N) news [created_by]
                ├─── (N) albums [created_by]
                ├─── (N) gallery_images [uploaded_by]
                └─── (N) contact_messages [replied_by]

albums (1) ───── (N) gallery_images [album_id]

settings (singleton) - No relationships
members - No relationships
team_members - No relationships
```

### Foreign Key Relationships

1. **volunteers.approved_by → users.id**
   - Tracks which admin approved the volunteer
   - ON DELETE: SET NULL (optional)

2. **activities.created_by → users.id**
   - Tracks which admin created the activity
   - ON DELETE: SET NULL (optional)

3. **news.created_by → users.id**
   - Tracks which admin created the news article
   - ON DELETE: SET NULL (optional)

4. **albums.created_by → users.id**
   - Tracks which admin created the album
   - ON DELETE: SET NULL (optional)

5. **gallery_images.album_id → albums.id**
   - Associates images with albums
   - ON DELETE: CASCADE (delete images when album deleted)

6. **gallery_images.uploaded_by → users.id**
   - Tracks who uploaded the image
   - ON DELETE: SET NULL (optional)

7. **contact_messages.replied_by → users.id**
   - Tracks which admin replied to message
   - ON DELETE: SET NULL (optional)

---

## Indexes

### Primary Key Indexes (Auto-created)

```sql
-- All tables have primary key indexes on 'id' column
users_pkey ON users(id)
settings_pkey ON settings(id)
members_pkey ON members(id)
volunteers_pkey ON volunteers(id)
activities_pkey ON activities(id)
news_pkey ON news(id)
albums_pkey ON albums(id)
gallery_images_pkey ON gallery_images(id)
team_members_pkey ON team_members(id)
contact_messages_pkey ON contact_messages(id)
```

### Unique Indexes

```sql
-- Ensure email uniqueness
users_email_key ON users(email)

-- Ensure member ID uniqueness
members_member_id_key ON members(member_id)

-- Ensure URL slug uniqueness
activities_slug_key ON activities(slug)
news_slug_key ON news(slug)
albums_slug_key ON albums(slug)
```

### Recommended Additional Indexes (for performance)

```sql
-- For faster volunteer filtering
CREATE INDEX idx_volunteers_status ON volunteers(status);

-- For faster activity filtering
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_date ON activities(activity_date);

-- For faster news filtering
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_date ON news(published_date);

-- For faster contact message filtering
CREATE INDEX idx_contact_status ON contact_messages(status);

-- For faster gallery queries
CREATE INDEX idx_gallery_album ON gallery_images(album_id);

-- For faster lookups on foreign keys
CREATE INDEX idx_volunteers_approved_by ON volunteers(approved_by);
CREATE INDEX idx_activities_created_by ON activities(created_by);
CREATE INDEX idx_news_created_by ON news(created_by);
```

---

## Sample Data

### Complete Sample Dataset

```sql
-- 1. Insert Super Admin
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'rasmi@admin.com', '$2a$10$YourHashedPasswordHere', 'super_admin');

-- 2. Insert Settings
INSERT INTO settings (id, ngo_name, registration_number, phone, email, address, map_location) VALUES
(1, 'BKSS Foundation', 'REG/2024/001', '+91 1234567890', 'info@bkss.org', 
'123 Main Street, City, State - 123456', 'https://maps.app.goo.gl/gpWCfhNcGKVwPz5A6');

-- 3. Insert Members
INSERT INTO members (member_id, name, mobile, email, occupation, qualification) VALUES
('BKSS-001', 'Raj Kumar', '+91 9876543210', 'raj@example.com', 'Engineer', 'B.Tech'),
('BKSS-002', 'Priya Singh', '+91 9876543211', 'priya@example.com', 'Teacher', 'M.Ed'),
('BKSS-003', 'Amit Sharma', '+91 9876543212', 'amit@example.com', 'Doctor', 'MBBS'),
('BKSS-004', 'Sneha Patel', '+91 9876543213', 'sneha@example.com', 'Lawyer', 'LLB'),
('BKSS-005', 'Vikram Rao', '+91 9876543214', 'vikram@example.com', 'Business', 'MBA');

-- 4. Insert Volunteers
INSERT INTO volunteers (name, email, phone, skills, interest, available_hours, status) VALUES
('Alice Johnson', 'alice@example.com', '+91 9876543215', 'Teaching, Event Management', 'Education', '10 hours/week', 'approved'),
('Bob Wilson', 'bob@example.com', '+91 9876543216', 'Medical Skills', 'Healthcare', '5 hours/week', 'pending'),
('Carol Brown', 'carol@example.com', '+91 9876543217', 'Social Work', 'Community Service', '15 hours/week', 'approved');

-- 5. Insert Activities
INSERT INTO activities (title, slug, description, activity_date, location, status) VALUES
('Medical Camp 2024', 'medical-camp-2024', 'Free medical checkup and medicines distribution for villagers', '2024-06-15', 'Village Health Center', 'completed'),
('Education Seminar', 'education-seminar', 'Career guidance and educational counseling for students', '2024-07-20', 'Community Hall', 'upcoming'),
('Blood Donation Drive', 'blood-donation-drive', 'Voluntary blood donation camp', '2024-08-10', 'City Hospital', 'upcoming');

-- 6. Insert News
INSERT INTO news (title, slug, content, excerpt, author, published_date, status) VALUES
('New Initiative Launch', 'new-initiative-launch', 'We are launching a new education initiative...', 'New education program announced', 'Admin', '2024-06-01', 'published'),
('Annual Report 2024', 'annual-report-2024', 'Our achievements and financial report for 2024...', 'Annual report now available', 'Admin', '2024-05-15', 'published');

-- 7. Insert Albums
INSERT INTO albums (name, slug, description) VALUES
('Events 2024', 'events-2024', 'All major events from 2024'),
('Medical Camps', 'medical-camps', 'Medical camp photographs'),
('Community Service', 'community-service', 'Community service activities');

-- 8. Insert Team Members
INSERT INTO team_members (name, position, email, phone, display_order) VALUES
('Dr. Rajesh Kumar', 'President', 'president@bkss.org', '+91 9876543218', 1),
('Mrs. Priya Sharma', 'Secretary', 'secretary@bkss.org', '+91 9876543219', 2),
('Mr. Amit Patel', 'Treasurer', 'treasurer@bkss.org', '+91 9876543220', 3);

-- 9. Insert Contact Messages
INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('Rahul Singh', 'rahul@example.com', 'Volunteer Inquiry', 'I would like to volunteer for upcoming events', 'read'),
('Sneha Gupta', 'sneha@example.com', 'Donation Query', 'How can I make a donation to your organization?', 'unread');
```

---

## SQL Scripts

### Complete Database Setup Script

```sql
-- BKSS Platform Database Schema
-- Version: 1.0.0
-- Database: PostgreSQL 12+

-- Drop existing tables (if needed)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create settings table (singleton)
CREATE TABLE settings (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (id = 1)
);

-- 3. Create members table
CREATE TABLE members (
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

-- 4. Create volunteers table
CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    skills TEXT,
    interest TEXT,
    available_hours VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    cover_image TEXT,
    activity_date DATE,
    location VARCHAR(255),
    organizer VARCHAR(255),
    participants_count INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'upcoming',
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create news table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT,
    excerpt TEXT,
    image TEXT,
    author VARCHAR(255),
    published_date DATE,
    status VARCHAR(30) DEFAULT 'draft',
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create albums table
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE,
    description TEXT,
    cover_image TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create gallery_images table
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    image_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create team_members table
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    photo TEXT,
    bio TEXT,
    email VARCHAR(150),
    phone VARCHAR(20),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create contact_messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'unread',
    replied_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reply_message TEXT,
    replied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create performance indexes
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_date ON activities(activity_date);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_date ON news(published_date);
CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_gallery_album ON gallery_images(album_id);

-- Insert default admin (password will be hashed by application)
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'rasmi@admin.com', '$2a$10$YourHashedPasswordHere', 'super_admin');

-- Insert default settings row
INSERT INTO settings (id) VALUES (1);

-- End of schema
```

---

## Backup & Restore

### Backup Database

**Full database backup:**
```bash
PGPASSWORD='postgres' pg_dump -U postgres -h localhost bkss_db > bkss_db_backup.sql
```

**Compressed backup:**
```bash
PGPASSWORD='postgres' pg_dump -U postgres -h localhost bkss_db | gzip > bkss_db_backup.sql.gz
```

**Backup specific tables:**
```bash
PGPASSWORD='postgres' pg_dump -U postgres -h localhost -t members -t volunteers bkss_db > partial_backup.sql
```

**Backup schema only (no data):**
```bash
PGPASSWORD='postgres' pg_dump -U postgres -h localhost --schema-only bkss_db > schema_only.sql
```

**Backup data only (no schema):**
```bash
PGPASSWORD='postgres' pg_dump -U postgres -h localhost --data-only bkss_db > data_only.sql
```

### Restore Database

**Restore from backup:**
```bash
PGPASSWORD='postgres' psql -U postgres -h localhost -d bkss_db < bkss_db_backup.sql
```

**Restore from compressed backup:**
```bash
gunzip -c bkss_db_backup.sql.gz | PGPASSWORD='postgres' psql -U postgres -h localhost -d bkss_db
```

**Drop and recreate database before restore:**
```bash
PGPASSWORD='postgres' psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS bkss_db;"
PGPASSWORD='postgres' psql -U postgres -h localhost -c "CREATE DATABASE bkss_db;"
PGPASSWORD='postgres' psql -U postgres -h localhost -d bkss_db < bkss_db_backup.sql
```

---

## Database Maintenance

### Common Queries

**Count records in all tables:**
```sql
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'settings', COUNT(*) FROM settings
UNION ALL SELECT 'members', COUNT(*) FROM members
UNION ALL SELECT 'volunteers', COUNT(*) FROM volunteers
UNION ALL SELECT 'activities', COUNT(*) FROM activities
UNION ALL SELECT 'news', COUNT(*) FROM news
UNION ALL SELECT 'albums', COUNT(*) FROM albums
UNION ALL SELECT 'gallery_images', COUNT(*) FROM gallery_images
UNION ALL SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL SELECT 'contact_messages', COUNT(*) FROM contact_messages;
```

**Database size:**
```sql
SELECT pg_size_pretty(pg_database_size('bkss_db')) as database_size;
```

**Table sizes:**
```sql
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
```

### Optimization

**Analyze tables:**
```sql
ANALYZE users;
ANALYZE members;
ANALYZE volunteers;
ANALYZE activities;
ANALYZE news;
ANALYZE albums;
ANALYZE gallery_images;
ANALYZE team_members;
ANALYZE contact_messages;
```

**Vacuum tables:**
```sql
VACUUM ANALYZE;
```

**Reindex database:**
```sql
REINDEX DATABASE bkss_db;
```

---

## Database Statistics

### Typical Production Database

```
Total Size: 50-200 MB
Tables: 10
Total Records: 1,000 - 10,000+

Breakdown:
- users: 5-20 records
- settings: 1 record (singleton)
- members: 100-500 records
- volunteers: 50-200 records
- activities: 50-100 records
- news: 30-100 records
- albums: 10-20 records
- gallery_images: 200-1000 records
- team_members: 5-15 records
- contact_messages: 100-1000 records
```

---

## Security Considerations

### Password Storage
- All passwords stored as bcrypt hashes
- Minimum 10 rounds of hashing
- Never store plain text passwords

### Database Access
- Use strong database passwords
- Limit connections to localhost only
- Use SSL for remote connections
- Regular security audits

### Data Protection
- Regular automated backups
- Keep backups in secure location
- Test restore procedures
- Implement backup retention policy

---

## Migration Guide

### Adding New Column

```sql
-- Example: Add 'notes' column to members table
ALTER TABLE members ADD COLUMN notes TEXT;
```

### Modifying Column

```sql
-- Example: Change email length in users table
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255);
```

### Adding Index

```sql
-- Example: Add index on members email
CREATE INDEX idx_members_email ON members(email);
```

### Adding Foreign Key

```sql
-- Example: Add relationship between tables
ALTER TABLE activities 
ADD CONSTRAINT fk_activities_approved_by 
FOREIGN KEY (approved_by) REFERENCES users(id);
```

---

## Troubleshooting

### Connection Issues

**Check if PostgreSQL is running:**
```bash
sudo systemctl status postgresql
```

**Test connection:**
```bash
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost -c "SELECT 1;"
```

### Performance Issues

**Check slow queries:**
```sql
SELECT pid, age(clock_timestamp(), query_start), usename, query 
FROM pg_stat_activity 
WHERE query != '<IDLE>' AND query NOT ILIKE '%pg_stat_activity%' 
ORDER BY query_start desc;
```

**Find missing indexes:**
```sql
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY abs(correlation) DESC;
```

---

## Quick Reference

### Essential Commands

```bash
# Connect to database
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost

# List tables
\dt

# Describe table
\d table_name

# List databases
\l

# Exit psql
\q

# Execute SQL file
PGPASSWORD='postgres' psql -U postgres -d bkss_db -h localhost -f script.sql
```

### Common SQL Operations

```sql
-- Count all users
SELECT COUNT(*) FROM users;

-- Get all admins
SELECT * FROM users WHERE role = 'admin';

-- Get pending volunteers
SELECT * FROM volunteers WHERE status = 'pending';

-- Get upcoming activities
SELECT * FROM activities WHERE status = 'upcoming' AND activity_date >= CURRENT_DATE;

-- Get published news
SELECT * FROM news WHERE status = 'published' ORDER BY published_date DESC;

-- Get unread messages
SELECT * FROM contact_messages WHERE status = 'unread' ORDER BY created_at DESC;
```

---

## Documentation Version

**Version:** 1.0.0  
**Last Updated:** 2024  
**Database:** PostgreSQL 12+  
**Platform:** BKSS Platform V1  
**Developer:** Rasmi Ranjan Senapati

---

**Complete Database Schema Documentation** ✅

For setup instructions, see: **SETUP_GUIDE.md**  
For deployment, see: **DEPLOYMENT_GUIDE.md**
