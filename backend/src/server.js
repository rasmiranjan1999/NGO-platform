import app from "./app.js";
import { env } from "./config/env.js";
import pool from "./config/db.js";

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("✅ Database Connected");

    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(
        `🚀 Server running on http://0.0.0.0:${env.PORT}`
      );
      console.log(
        `🌐 Access via: http://129.154.242.164:${env.PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Server Start Failed");
    console.error(error);
  }
};

startServer();