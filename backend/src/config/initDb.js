import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runMigrations } from "./migrations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize database by running schema.sql
 * This function checks and creates all tables if they don't exist
 */
export const initializeDatabase = async (db) => {
  try {
    console.log("🔍 Checking database schema...");

    // First, run migrations to add any missing columns to existing tables
    await runMigrations(db);

    // Read the schema.sql file
    const schemaPath = path.join(__dirname, "../../schema.sql");
    
    if (!fs.existsSync(schemaPath)) {
      console.error("❌ schema.sql file not found at:", schemaPath);
      return false;
    }

    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    // Execute the schema SQL
    await db.query(schemaSQL);

    console.log("✅ Database schema initialized successfully");

    // Verify all tables exist
    const tables = [
      "users",
      "settings",
      "members",
      "volunteers",
      "team_members",
      "activities",
      "news",
      "albums",
      "gallery_images",
      "contact_messages",
    ];

    console.log("🔍 Verifying tables...");
    
    for (const table of tables) {
      const result = await db.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );

      if (result.rows[0].exists) {
        console.log(`  ✓ Table '${table}' exists`);
      } else {
        console.log(`  ✗ Table '${table}' missing!`);
      }
    }

    // Check if default admin exists
    const adminCheck = await db.query(
      "SELECT COUNT(*) FROM users WHERE role = 'super_admin'"
    );

    if (parseInt(adminCheck.rows[0].count) > 0) {
      console.log("✅ Default super admin exists");
    } else {
      console.log("⚠️  No super admin found - check schema.sql");
    }

    // Check if default settings exist
    const settingsCheck = await db.query("SELECT COUNT(*) FROM settings");

    if (parseInt(settingsCheck.rows[0].count) > 0) {
      console.log("✅ Settings table initialized");
    } else {
      console.log("⚠️  Settings table is empty");
    }

    console.log("✅ Database initialization complete\n");
    return true;

  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
    console.error("Stack:", error.stack);
    return false;
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async (db) => {
  try {
    const stats = {};

    const tables = [
      "users",
      "settings",
      "members",
      "volunteers",
      "team_members",
      "activities",
      "news",
      "albums",
      "gallery_images",
      "contact_messages",
    ];

    for (const table of tables) {
      const result = await db.query(`SELECT COUNT(*) FROM ${table}`);
      stats[table] = parseInt(result.rows[0].count);
    }

    return stats;
  } catch (error) {
    console.error("Error getting database stats:", error.message);
    return null;
  }
};
