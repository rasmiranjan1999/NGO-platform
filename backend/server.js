import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import pkg from "pg";
import { initializeDatabase, getDatabaseStats } from "./src/config/initDb.js";

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL Connected");
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log("");

    // Set database pool in app locals
    app.locals.db = pool;

    // Initialize database schema (creates tables if not exists)
    const initialized = await initializeDatabase(pool);

    if (!initialized) {
      console.error("⚠️  Database initialization had issues, but continuing...");
    }

    // Get and display database statistics
    const stats = await getDatabaseStats(pool);
    if (stats) {
      console.log("📊 Database Statistics:");
      console.log(`   Users: ${stats.users}`);
      console.log(`   Members: ${stats.members}`);
      console.log(`   Volunteers: ${stats.volunteers}`);
      console.log(`   Team Members: ${stats.team_members}`);
      console.log(`   Activities: ${stats.activities}`);
      console.log(`   News: ${stats.news}`);
      console.log(`   Albums: ${stats.albums}`);
      console.log(`   Gallery Images: ${stats.gallery_images}`);
      console.log(`   Contact Messages: ${stats.contact_messages}`);
      console.log("");
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 BKSS Backend Running on Port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("");
      console.log("📝 Default Admin Credentials:");
      console.log("   Email: rasmi@admin.com");
      console.log("   Password: admin@123");
      console.log("");
    });

  } catch (error) {
    console.error("❌ Server Startup Failed");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

startServer();