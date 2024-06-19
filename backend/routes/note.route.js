const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/ultilities");
const {
  addNote,
  editNote,
  getNotes,
  deleteNote,
  updateNotePinned,
  searchNote,
} = require("../controllers/note.controller");

router.post("/add-note", authenticateToken, addNote);
router.put("/edit-note/:noteId", authenticateToken, editNote);
router.get("/get-notes", authenticateToken, getNotes);
router.delete("/delete-note/:noteId", authenticateToken, deleteNote);
router.put("/update-note-pinned/:noteId", authenticateToken, updateNotePinned);
router.get("/search-note", authenticateToken, searchNote);

module.exports = router;
