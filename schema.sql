DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    ngo_name VARCHAR(255) DEFAULT 'Baba Kshyameswar Swechha Sebi Sangathan',
    phone VARCHAR(50) DEFAULT '+91 XXXXXXXXXX',
    email VARCHAR(100) DEFAULT 'info@bkss.org',
    history TEXT,
    vision TEXT,
    mission TEXT
);

CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    photo TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    volunteer_id VARCHAR(50) UNIQUE DEFAULT NULL
);

INSERT INTO settings (id, ngo_name, history, vision, mission)
VALUES (1, 'Baba Kshyameswar Swechha Sebi Sangathan', 'Initial history text...', 'Initial vision statement...', 'Initial mission statement...')
ON CONFLICT (id) DO NOTHING;
