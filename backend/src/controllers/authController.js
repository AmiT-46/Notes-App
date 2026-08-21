const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const { bcryptSaltRounds } = require("../config/env");
const { createAccessToken, publicUser } = require("../services/authService");

const isBcryptHash = (value) => /^\$2[aby]\$\d{2}\$/.test(value);

async function signup(req, res, next) {
  try {
    const { fullName, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ error: true, message: "User already exists" });
    const user = await User.create({ fullName, email: normalizedEmail, password: await bcrypt.hash(password, bcryptSaltRounds) });
    return res.status(201).json({ error: false, user: publicUser(user), accessToken: createAccessToken(user._id), message: "Registration successful" });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: true, message: "User already exists" });
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(401).json({ error: true, message: "Invalid email or password" });
    if (!isBcryptHash(user.password)) return res.status(403).json({ error: true, message: "This legacy account requires a password reset. Please contact support." });
    if (!await bcrypt.compare(req.body.password, user.password)) return res.status(401).json({ error: true, message: "Invalid email or password" });
    return res.json({ error: false, user: publicUser(user), accessToken: createAccessToken(user._id), message: "Login successful" });
  } catch (error) { return next(error); }
}

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: true, message: "User not found" });
    return res.json({ error: false, user: publicUser(user), message: "User info retrieved successfully" });
  } catch (error) { return next(error); }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: true, message: "User not found" });
    const { fullName, currentPassword, newPassword } = req.body;
    if (newPassword) {
      if (!isBcryptHash(user.password)) return res.status(403).json({ error: true, message: "This legacy account requires a password reset. Please contact support." });
      if (!await bcrypt.compare(currentPassword, user.password)) return res.status(401).json({ error: true, message: "Current password is incorrect" });
      user.password = await bcrypt.hash(newPassword, bcryptSaltRounds);
    }
    if (fullName) user.fullName = fullName;
    await user.save();
    return res.json({ error: false, user: publicUser(user), message: "Profile updated successfully" });
  } catch (error) { return next(error); }
}

module.exports = { signup, login, getUser, updateProfile };
