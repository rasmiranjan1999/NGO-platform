/**
 * Database migrations to add missing columns to existing tables
 * This ensures backward compatibility when schema changes
 */

export const runMigrations = async (db) => {
  console.log("🔧 Running database migrations...");

  try {
    // Migration 1: Add missing columns to settings table
    await addColumnIfNotExists(
      db,
      "settings",
      "registration_number",
      "VARCHAR(100)"
    );

    await addColumnIfNotExists(
      db,
      "settings",
      "twitter",
      "TEXT"
    );

    await addColumnIfNotExists(
      db,
      "settings",
      "linkedin",
      "TEXT"
    );

    await addColumnIfNotExists(
      db,
      "settings",
      "president_photo",
      "TEXT"
    );

    await addColumnIfNotExists(
      db,
      "settings",
      "president_message",
      "TEXT"
    );

    await addColumnIfNotExists(
      db,
      "settings",
      "secretary_photo",
      "TEXT"
    );

    await addColumnIfNotExists(
      db,
      "settings",
      "secretary_message",
      "TEXT"
    );

    // Migration 2: Add missing columns to members table
    await addColumnIfNotExists(
      db,
      "members",
      "blood_group",
      "VARCHAR(20)"
    );

    await addColumnIfNotExists(
      db,
      "members",
      "gender",
      "VARCHAR(20)"
    );

    await addColumnIfNotExists(
      db,
      "members",
      "date_of_birth",
      "DATE"
    );

    await addColumnIfNotExists(
      db,
      "members",
      "joining_date",
      "DATE"
    );

    // Migration 3: Add missing columns to volunteers table
    await addColumnIfNotExists(
      db,
      "volunteers",
      "blood_group",
      "VARCHAR(20)"
    );

    await addColumnIfNotExists(
      db,
      "volunteers",
      "gender",
      "VARCHAR(20)"
    );

    await addColumnIfNotExists(
      db,
      "volunteers",
      "date_of_birth",
      "DATE"
    );

    // Migration 4: Add missing columns to activities table
    await addColumnIfNotExists(
      db,
      "activities",
      "location",
      "VARCHAR(255)"
    );

    // Migration 5: Add missing columns to news table
    await addColumnIfNotExists(
      db,
      "news",
      "publish_date",
      "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    );

    console.log("✅ Migrations completed successfully\n");
    return true;

  } catch (error) {
    console.error("❌ Migration error:", error.message);
    return false;
  }
};

/**
 * Helper function to add a column if it doesn't exist
 */
async function addColumnIfNotExists(db, tableName, columnName, columnType) {
  try {
    // Check if column exists
    const result = await db.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = $1 AND column_name = $2`,
      [tableName, columnName]
    );

    if (result.rows.length === 0) {
      // Column doesn't exist, add it
      await db.query(
        `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`
      );
      console.log(`  ✓ Added column '${columnName}' to '${tableName}'`);
    } else {
      console.log(`  ✓ Column '${columnName}' already exists in '${tableName}'`);
    }

    return true;
  } catch (error) {
    console.error(`  ✗ Error adding column '${columnName}' to '${tableName}':`, error.message);
    return false;
  }
}
