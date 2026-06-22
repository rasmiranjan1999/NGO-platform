-- Add map_location field to settings table
-- This stores the Google Maps share link (e.g., https://maps.app.goo.gl/gpWCfhNcGKVwPz5A6)

ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS map_location TEXT;

-- Set default value for existing row
UPDATE settings 
SET map_location = 'https://maps.app.goo.gl/gpWCfhNcGKVwPz5A6' 
WHERE id = 1 AND map_location IS NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'settings' AND column_name = 'map_location';
