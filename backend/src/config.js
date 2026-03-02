import dotenv from "dotenv";

dotenv.config();

const corsOriginsRaw = process.env.CORS_ORIGINS ?? "http://localhost:5173";

export const config = {
  env: process.env.APP_ENV ?? process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 8000),
  mongoUri:
    process.env.MONGODB_URI ??
    process.env.DATABASE_URL ??
    "mongodb://localhost:27017/aitc",
  corsOrigins: corsOriginsRaw.split(",").map((item) => item.trim()).filter(Boolean)
};
