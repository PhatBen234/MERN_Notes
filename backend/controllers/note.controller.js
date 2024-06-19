const Note = require("../models/note.model");

// Add Note
const addNote = async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to add note",
    });
  }
};

// Edit Note
const editNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;

  if (!title && !content && !tags && isPinned === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      { _id: noteId, userId: req.user._id },
      { title, content, tags, isPinned },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    return res.json({
      error: false,
      note: updatedNote,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Get Notes
const getNotes = async (req, res) => {
  const { user } = req;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Update Note Pinned Status
const updateNotePinned = async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: { isPinned } },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    return res.json({
      error: false,
      note: updatedNote,
      message: "Note pinned status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

const searchNote = async (req, res) => {
  const { user } = req;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Matching notes retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addNote,
  editNote,
  getNotes,
  deleteNote,
  updateNotePinned,
  searchNote
};
