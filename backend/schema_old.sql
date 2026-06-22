-- 1. Create the Settings Table if it does not exist
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    ngo_name VARCHAR(255) DEFAULT 'Baba Kshyameswar Swechha Sebi Sangathan',
    phone VARCHAR(50) DEFAULT '+91 XXXXXXXXXX',
    email VARCHAR(100) DEFAULT 'info@bkss.org',
    history TEXT,
    vision TEXT,
    mission TEXT
);

-- 2. Create the Volunteers Table if it does not exist
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    photo TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    volunteer_id VARCHAR(50) UNIQUE DEFAULT NULL
);

-- 3. Create the Users Table for Admin Login
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin'
);

-- --- SEED DATA ENGINE ---

-- Seed initial settings row only if it doesn't exist yet
INSERT INTO settings (id, ngo_name, history, vision, mission)
VALUES (1, 'Baba Kshyameswar Swechha Sebi Sangathan', 'Initial history text...', 'Initial vision statement...', 'Initial mission statement...')
ON CONFLICT (id) DO NOTHING;

-- Seed default admin account only if it doesn't exist yet
-- Credentials -> Username: admin | Password: password123
INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$10$8K967r8DpyoH.7mR39oRNeXGvsz2Aep8yTqI982YqD1BfTq6XvebW', 'admin')
ON CONFLICT (username) DO NOTHING;