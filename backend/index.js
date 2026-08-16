require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const { authenticateToken, createAccessToken } = require("./utilities");

const app = express();
const passwordRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri).catch((error) => {
  console.error("Database connection failed", error);
  process.exit(1);
});

app.use(express.json());
app.use(cors({ origin: "*" }));

function publicUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    createdOn: user.createdOn,
  };
}

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

app.get("/", (req, res) => {
  res.json({ message: "/ endpoint is working" });
});

// Create Account / Signup
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!fullName?.trim()) {
    return res.status(400).json({ error: true, message: "Full Name is required" });
  }
  if (!normalizedEmail) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: true, message: "Password must be at least 8 characters" });
  }

  try {
    const isUser = await User.findOne({ email: normalizedEmail });
    if (isUser) {
      return res.status(409).json({ error: true, message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, passwordRounds);
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: passwordHash,
    });

    return res.status(201).json({
      error: false,
      user: publicUser(user),
      accessToken: createAccessToken(user._id),
      message: "Registration successful",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: true, message: "User already exists" });
    }
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Login / Signin
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: true, message: "Password is required" });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: true, message: "Invalid email or password" });
    }

    let passwordMatches = false;
    if (isBcryptHash(user.password)) {
      passwordMatches = await bcrypt.compare(password, user.password);
    } else {
      passwordMatches = password === user.password;
      if (passwordMatches) {
        user.password = await bcrypt.hash(password, passwordRounds);
        await user.save();
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: true, message: "Invalid email or password" });
    }

    return res.json({
      error: false,
      user: publicUser(user),
      accessToken: createAccessToken(user._id),
      message: "Login successful",
    });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.sendStatus(401);

    return res.json({ user: publicUser(user), message: "User info extracted successfully" });
  } catch {
    return res.sendStatus(401);
  }
});

// Update profile
app.patch("/update-profile", authenticateToken, async (req, res) => {
  const { fullName, currentPassword, newPassword } = req.body;
  const wantsNameUpdate = fullName !== undefined;
  const wantsPasswordUpdate = currentPassword !== undefined || newPassword !== undefined;

  if (!wantsNameUpdate && !wantsPasswordUpdate) {
    return res.status(400).json({ error: true, message: "No profile changes provided" });
  }
  if (wantsNameUpdate && !fullName?.trim()) {
    return res.status(400).json({ error: true, message: "Name cannot be empty" });
  }
  if (wantsPasswordUpdate && (!currentPassword || !newPassword)) {
    return res.status(400).json({ error: true, message: "Current and new passwords are required" });
  }
  if (newPassword && newPassword.length < 8) {
    return res.status(400).json({ error: true, message: "New password must be at least 8 characters" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.sendStatus(401);

    if (wantsPasswordUpdate) {
      const currentPasswordMatches = isBcryptHash(user.password)
        ? await bcrypt.compare(currentPassword, user.password)
        : currentPassword === user.password;

      if (!currentPasswordMatches) {
        return res.status(401).json({ error: true, message: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, passwordRounds);
    }

    if (wantsNameUpdate) user.fullName = fullName.trim();
    await user.save();

    return res.json({ error: false, user: publicUser(user), message: "Profile updated successfully" });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: true, message: "Title is required" });
  if (!content?.trim()) return res.status(400).json({ error: true, message: "Content is required" });

  try {
    const note = await Note.create({ title: title.trim(), content: content.trim(), tags: tags || [], userId: req.userId });
    return res.json({ error: false, note, message: "Note added successfully" });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { title, content, tags, isPinned } = req.body;
  if (title === undefined && content === undefined && tags === undefined && isPinned === undefined) {
    return res.status(400).json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.userId });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    await note.save();

    return res.json({ error: false, note, message: "Note updated successfully" });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ isPinned: -1, createdOn: -1 });
    return res.json({ error: false, notes, message: "All notes retrieved successfully" });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.noteId, userId: req.userId });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Update pinned state
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  if (typeof req.body.isPinned !== "boolean") {
    return res.status(400).json({ error: true, message: "isPinned must be a boolean" });
  }

  try {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.userId });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });
    note.isPinned = req.body.isPinned;
    await note.save();
    return res.json({ error: false, note, message: "Note updated successfully" });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
  const { query } = req.query;
  if (!query?.trim()) return res.status(400).json({ error: true, message: "Search query is required" });

  try {
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matchingNotes = await Note.find({
      userId: req.userId,
      $or: [
        { title: { $regex: new RegExp(escapedQuery, "i") } },
        { content: { $regex: new RegExp(escapedQuery, "i") } },
      ],
    });
    return res.json({ error: false, notes: matchingNotes, message: "Matching notes retrieved successfully" });
  } catch {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

if (require.main === module) {
  app.listen(8000, () => console.log("Server listening on port 8000"));
}

module.exports = app;
