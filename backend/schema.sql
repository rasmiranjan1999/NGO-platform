-- ==========================================
-- BKSS NGO DATABASE SCHEMA
-- ==========================================

-- ==========================================
-- USERS (SUPER ADMIN + ADMIN)
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SETTINGS
-- ==========================================

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    ngo_name VARCHAR(255) DEFAULT 'Baba Kshyameswar Swechha Sebi Sangathan',
    registration_number VARCHAR(100),
    logo TEXT,
    favicon TEXT,
    phone VARCHAR(50),
    email VARCHAR(150),
    address TEXT,
    facebook TEXT,
    instagram TEXT,
    youtube TEXT,
    twitter TEXT,
    linkedin TEXT,
    history TEXT,
    vision TEXT,
    mission TEXT,
    president_photo TEXT,
    president_message TEXT,
    secretary_photo TEXT,
    secretary_message TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MEMBERS
-- ==========================================

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo TEXT,
    mobile VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    occupation VARCHAR(150),
    qualification VARCHAR(150),
    blood_group VARCHAR(20),
    gender VARCHAR(20),
    date_of_birth DATE,
    joining_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- VOLUNTEERS
-- ==========================================

CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    volunteer_id VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    education VARCHAR(150),
    occupation VARCHAR(150),
    blood_group VARCHAR(20),
    gender VARCHAR(20),
    date_of_birth DATE,
    photo TEXT,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TEAM MEMBERS
-- ==========================================

CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    photo TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ACTIVITIES
-- ==========================================

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    cover_image TEXT,
    description TEXT,
    location VARCHAR(255),
    activity_date DATE,
    publish_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- NEWS
-- ==========================================

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    cover_image TEXT,
    description TEXT,
    publish_status BOOLEAN DEFAULT TRUE,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- GALLERY ALBUMS
-- ==========================================

CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- GALLERY IMAGES
-- ==========================================

CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    image TEXT NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- CONTACT MESSAGES
-- ==========================================

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    email VARCHAR(150),
    subject VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- DEFAULT SETTINGS RECORD
-- ==========================================

INSERT INTO settings (
    id,
    ngo_name,
    registration_number,
    history,
    vision,
    mission,
    president_message
)
VALUES (
    1,
    'Baba Kshyameswar Swechha Sebi Sangathan',
    'REG/2024/001',
    'We are a dedicated NGO working towards the welfare of our community through various social initiatives and programmes.',
    'To create a compassionate and empowered society where every individual has access to basic necessities and opportunities for growth.',
    'Our mission is to serve the community through welfare programs, relief work, and awareness drives that create lasting positive impact.',
    'Welcome to BKSS. Together, we can build a stronger and more compassionate community. Every small act of kindness creates ripples of positive change.'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- DEFAULT SUPER ADMIN
-- Email: rasmi@admin.com
-- Password: admin@123
-- ==========================================

INSERT INTO users (
    name,
    email,
    password,
    role
)
VALUES (
    'Super Admin',
    'rasmi@admin.com',
    '$2b$10$6YzDYGrsCKkBJM5Cw2v3hutL7R3aye11g4eQ9dnYnmCLKaeC74TM2',
    'super_admin'
)
ON CONFLICT (email) DO NOTHING;
