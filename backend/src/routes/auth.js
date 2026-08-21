const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const { schemas, validate } = require("../middleware/validate");

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, message: { error: true, message: "Too many attempts. Please try again later." } });

router.post("/create-account", authLimiter, validate(schemas.signup), controller.signup);
router.post("/login", authLimiter, validate(schemas.login), controller.login);
router.get("/get-user", authenticateToken, controller.getUser);
router.patch("/update-profile", authenticateToken, validate(schemas.profile), controller.updateProfile);
module.exports = router;
