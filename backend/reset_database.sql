-- ==========================================
-- BKSS PLATFORM - DATABASE RESET SCRIPT
-- ==========================================
-- This script will:
-- 1. Clean all unnecessary data
-- 2. Keep only Super Admin account
-- 3. Reset NGO settings to blank state
-- 4. Clear all uploaded files metadata
-- ==========================================

-- ==========================================
-- 1. DELETE ALL DATA FROM TABLES
-- ==========================================

-- Delete contact messages
DELETE FROM contact_messages;

-- Delete gallery images
DELETE FROM gallery_images;

-- Delete albums
DELETE FROM albums;

-- Delete news
DELETE FROM news;

-- Delete activities
DELETE FROM activities;

-- Delete team members
DELETE FROM team_members;

-- Delete volunteers
DELETE FROM volunteers;

-- Delete members
DELETE FROM members;

-- Delete all admins (keep only super admin)
DELETE FROM users WHERE role != 'super_admin';

-- ==========================================
-- 2. RESET AUTO-INCREMENT SEQUENCES
-- ==========================================

ALTER SEQUENCE contact_messages_id_seq RESTART WITH 1;
ALTER SEQUENCE gallery_images_id_seq RESTART WITH 1;
ALTER SEQUENCE albums_id_seq RESTART WITH 1;
ALTER SEQUENCE news_id_seq RESTART WITH 1;
ALTER SEQUENCE activities_id_seq RESTART WITH 1;
ALTER SEQUENCE team_members_id_seq RESTART WITH 1;
ALTER SEQUENCE volunteers_id_seq RESTART WITH 1;
ALTER SEQUENCE members_id_seq RESTART WITH 1;

-- ==========================================
-- 3. RESET SETTINGS TO BLANK STATE
-- ==========================================

UPDATE settings SET
    ngo_name = 'NGO',
    registration_number = NULL,
    logo = NULL,
    favicon = NULL,
    phone = NULL,
    email = NULL,
    address = NULL,
    facebook = NULL,
    instagram = NULL,
    youtube = NULL,
    twitter = NULL,
    linkedin = NULL,
    history = NULL,
    vision = NULL,
    mission = NULL,
    president_photo = NULL,
    president_message = NULL,
    secretary_photo = NULL,
    secretary_message = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- If settings record doesn't exist, create blank one
INSERT INTO settings (
    id,
    ngo_name
)
VALUES (
    1,
    'NGO'
)
ON CONFLICT (id) DO UPDATE SET
    ngo_name = 'NGO',
    registration_number = NULL,
    logo = NULL,
    favicon = NULL,
    phone = NULL,
    email = NULL,
    address = NULL,
    facebook = NULL,
    instagram = NULL,
    youtube = NULL,
    twitter = NULL,
    linkedin = NULL,
    history = NULL,
    vision = NULL,
    mission = NULL,
    president_photo = NULL,
    president_message = NULL,
    secretary_photo = NULL,
    secretary_message = NULL;

-- ==========================================
-- 4. ENSURE SUPER ADMIN EXISTS
-- ==========================================
-- Email: rasmi@admin.com
-- Password: admin@123
-- ==========================================

INSERT INTO users (
    name,
    email,
    password,
    role,
    is_active
)
VALUES (
    'Super Admin',
    'rasmi@admin.com',
    '$2b$10$6YzDYGrsCKkBJM5Cw2v3hutL7R3aye11g4eQ9dnYnmCLKaeC74TM2',
    'super_admin',
    TRUE
)
ON CONFLICT (email) DO UPDATE SET
    name = 'Super Admin',
    password = '$2b$10$6YzDYGrsCKkBJM5Cw2v3hutL7R3aye11g4eQ9dnYnmCLKaeC74TM2',
    role = 'super_admin',
    is_active = TRUE;

-- ==========================================
-- 5. VERIFICATION QUERIES
-- ==========================================

-- Check remaining records
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Settings', COUNT(*) FROM settings
UNION ALL
SELECT 'Members', COUNT(*) FROM members
UNION ALL
SELECT 'Volunteers', COUNT(*) FROM volunteers
UNION ALL
SELECT 'Team Members', COUNT(*) FROM team_members
UNION ALL
SELECT 'Activities', COUNT(*) FROM activities
UNION ALL
SELECT 'News', COUNT(*) FROM news
UNION ALL
SELECT 'Albums', COUNT(*) FROM albums
UNION ALL
SELECT 'Gallery Images', COUNT(*) FROM gallery_images
UNION ALL
SELECT 'Contact Messages', COUNT(*) FROM contact_messages;

-- Show Super Admin details
SELECT id, name, email, role, is_active, created_at 
FROM users 
WHERE role = 'super_admin';

-- Show settings
SELECT ngo_name, registration_number, email, phone 
FROM settings 
WHERE id = 1;

-- ==========================================
-- RESET COMPLETE!
-- ==========================================
-- Super Admin Credentials:
-- Email: rasmi@admin.com
-- Password: admin@123
-- ==========================================
