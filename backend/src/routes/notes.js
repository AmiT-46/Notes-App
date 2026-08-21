const express = require("express");
const controller = require("../controllers/notesController");
const { authenticateToken } = require("../middleware/auth");
const { schemas, validate } = require("../middleware/validate");

const router = express.Router();
router.use(authenticateToken);
router.post("/add-note", validate(schemas.createNote), controller.createNote);
router.get("/get-all-notes", validate(schemas.notesQuery, "query"), controller.listNotes);
router.get("/search-notes", validate(schemas.searchQuery, "query"), controller.searchNotes);
router.patch("/api/notes/:noteId", validate(schemas.noteParams, "params"), validate(schemas.updateNote), controller.updateNote);
router.put("/edit-note/:noteId", validate(schemas.noteParams, "params"), validate(schemas.updateNote), controller.updateNote);
router.delete("/delete-note/:noteId", validate(schemas.noteParams, "params"), controller.deleteNote);
module.exports = router;
