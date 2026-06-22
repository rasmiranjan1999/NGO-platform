import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || "bkss_db",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "",

  JWT_SECRET:
    process.env.JWT_SECRET || "bkss_super_secret_key_2026",
};