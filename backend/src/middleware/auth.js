const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/env");

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: true, message: "Authentication required" });

  try {
    const payload = jwt.verify(token, accessTokenSecret);
    if (!payload?.sub) throw new Error("Invalid token");
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: true, message: "Invalid or expired token" });
  }
}

module.exports = { authenticateToken };
