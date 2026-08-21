const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { corsOrigins } = require("./config/env");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(helmet());
app.use(cors({ origin(origin, callback) { if (!origin || corsOrigins.includes(origin)) return callback(null, true); return callback(new Error("Origin not allowed by CORS")); }, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.get("/", (req, res) => res.json({ message: "/ endpoint is working" }));
app.use(authRoutes);
app.use(noteRoutes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
