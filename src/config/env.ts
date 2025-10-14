import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "4000",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || "",
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
  R2_BUCKET: process.env.R2_BUCKET || "",
  R2_ENDPOINT: process.env.R2_ENDPOINT || "",
  PUBLIC_URL: process.env.PUBLIC_URL || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  FROM_EMAIL: process.env.FROM_EMAIL || "",
  CHAPA_API_BASE: 'https://api.chapa.co/v1',
  CHAPA_SECRET: process.env.CHAPA_SECRET_KEY,
  CHAPA_CALLBACK_URL: process.env.CHAPA_CALLBACK_URL,
  CHAPA_RETURN_URL: process.env.CHAPA_RETURN_URL,
  CHAPA_WEBHOOK_SECRET: process.env.CHAPA_WEBHOOK_SECRET,
};
