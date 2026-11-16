import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: process.env.PORT || 5000,

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  mongoUri: process.env.MONGO_URI,

  accessTokenSecret: process.env.JWT_ACCESS_SECRET,

  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,

  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,

  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  brevoSmtpUser: process.env.BREVO_SMTP_USER,

  brevoSmtpKey: process.env.BREVO_SMTP_KEY,

  brevoSenderEmail: process.env.BREVO_SENDER_EMAIL,

  geminiApiKey: process.env.GEMINI_API_KEY,
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI is not defined in the .env file");
}

if (!env.accessTokenSecret) {
  throw new Error("JWT_ACCESS_SECRET is not defined in the .env file");
}

if (!env.refreshTokenSecret) {
  throw new Error("JWT_REFRESH_SECRET is not defined in the .env file");
}

if (
  !env.cloudinaryCloudName ||
  !env.cloudinaryApiKey ||
  !env.cloudinaryApiSecret
) {
  throw new Error(
    "Cloudinary environment variables are missing from the .env file",
  );
}

if (!env.brevoSmtpUser || !env.brevoSmtpKey || !env.brevoSenderEmail) {
  throw new Error("Brevo environment variables are missing from the .env file");
}

if (!env.geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the .env file");
}

export default env;
