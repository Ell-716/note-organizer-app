const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// Reusable helper
function loadNotes() {
    if (!fs.existsSync("notes.json")) {
        return [];
    }
    const data = fs.readFileSync("notes.json", "utf8");
    return JSON.parse(data);
}

function saveNotes(notes) {
    fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));
}

// Create a note
app.post("/notes", function (req, res) {
    const { title, body } = req.body;

    // Basic validation
    if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required" });
    }

    const notes = loadNotes();

    const newNote = {
        title: title,
        body: body,
        time_added: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotes(notes);

    res.status(201).json({
        message: "Note added successfully!",
        note: newNote
    });
});

// Get all notes
app.get("/notes", (req, res) => {
    const notes = loadNotes();
    res.json(notes);
});

// Get a single note by title
app.get("/notes/:title", (req, res) => {
    const title = req.params.title;

    const notes = loadNotes();

    const note = notes.find(
        n => n.title.toLowerCase() ==== title.toLowerCase()
    );

    if (!note) {
        return res.status(404).json({
            error: `Note with title "${title}" not found`
        });
    }

    res.json(note);
});

// Delete a note by title
app.delete("notes/:title", (req, res) => {
    const title = req.params.title;

    const notes = loadNotes();

    const index = notes.findIndex(
        n => n.title.toLowerCase() === title.toLowerCase()
    );

    if (index === -1) {
        return res.status(404).json({
            error: `Note with title "${title}" not found`
        });
    }

    const deleteNote = notes.splice(index, 1) [0];
    saveNotes(notes);

    res.json({
        message: "Note deleted successfully!",
        note:deleteNote
    });
});

// Update a note by title
app.put("/notes/:title", (req, res) => {
    const title = req.params.title;
    const { body } = req.body;

    // Validation
    if (!body) {
        return res.status(400).json({
            error: "New note body is required"
        });
    }

    const notes = loadNotes();

    const note = notes.find(
        n => n.title.toLowerCase() === title.toLowerCase()
    );

    if (!note) {
        return res.status(404).json({
            error: `Note with title "${title}" not found`
        });
    }

    note.body = body;
    saveNotes(notes);

    res.json({
        message: "Note updated successfully!",
        note:note
    });
});