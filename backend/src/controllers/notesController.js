const Note = require("../../models/note.model");

async function createNote(req, res, next) {
  try {
    const note = await Note.create({ ...req.body, userId: req.userId });
    return res.status(201).json({ error: false, note, message: "Note added successfully" });
  } catch (error) { return next(error); }
}

async function listNotes(req, res, next) {
  try {
    const { page, limit } = req.query;
    const filter = { userId: req.userId };
    const [notes, total] = await Promise.all([Note.find(filter).sort({ isPinned: -1, createdOn: -1 }).skip((page - 1) * limit).limit(limit), Note.countDocuments(filter)]);
    return res.json({ error: false, notes, pagination: { page, limit, total }, message: "All notes retrieved successfully" });
  } catch (error) { return next(error); }
}

async function updateNote(req, res, next) {
  try {
    const note = await Note.findOneAndUpdate({ _id: req.params.noteId, userId: req.userId }, req.body, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });
    return res.json({ error: false, note, message: "Note updated successfully" });
  } catch (error) { return next(error); }
}

async function deleteNote(req, res, next) {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.noteId, userId: req.userId });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) { return next(error); }
}

async function searchNotes(req, res, next) {
  try {
    const escaped = req.query.query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const notes = await Note.find({
      userId: req.userId,
      $or: [
        { title: { $regex: escaped, $options: "i" } },
        { content: { $regex: escaped, $options: "i" } },
      ],
    }).sort({ isPinned: -1, createdOn: -1 });
    return res.json({ error: false, notes, message: "Matching notes retrieved successfully" });
  } catch (error) { return next(error); }
}

module.exports = { createNote, listNotes, updateNote, deleteNote, searchNotes };
