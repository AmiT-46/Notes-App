require("dotenv").config();

const required = ["MONGODB_URI", "ACCESS_TOKEN_SECRET"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
if (!Number.isInteger(saltRounds) || saltRounds < 10) {
  throw new Error("BCRYPT_SALT_ROUNDS must be an integer of at least 10");
}

module.exports = {
  mongoUri: process.env.MONGODB_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  bcryptSaltRounds: saltRounds,
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()).filter(Boolean),
  port: Number.parseInt(process.env.PORT || "8000", 10),
};
