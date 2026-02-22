const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const NOTES_FILE = path.join(__dirname, "notes.json");
const multer = require("multer");
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");

// Ensure uploads directory exists
async function ensureUploadsDir() {
    try {
        await fs.access(UPLOADS_DIR);
    } catch {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
    }
}

// Multer config with unique filenames
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 9);
        cb(null, `note-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Reusable helper
async function loadNotes() {
    try {
        const data = await fs.readFile(NOTES_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }

        console.error("Error reading or parsing notes.json:", error.message);
        return [];
    }
}

async function saveNotes(notes) {
    await fs.writeFile(
        NOTES_FILE, 
        JSON.stringify(notes, null, 2), 
        "utf8"
    );
}

// Create a note
app.post("/notes", async (req, res) =>{
    const { title, body } = req.body;

    // Basic validation
    if (!title || !body) {
        return res.status(400).json({ 
            error: "Title and body are required" 
        });
    }

    const notes = await loadNotes();

    const normalizedTitle = title.trim().toLowerCase();

    const duplicate = notes.find(
        n => n.title.trim().toLowerCase() === normalizedTitle
    );

    if (duplicate) {
        return res.status(409).json({
            error: `Note with title "${title}" already exists`
        });
    }

    const newNote = {
        title: title.trim(),
        body: body.trim(),
        time_added: new Date().toISOString()
    };

    notes.push(newNote);
    await saveNotes(notes);

    res.status(201).json({
        message: "Note added successfully!",
        note: newNote
    });
});

// Get all notes
app.get("/notes", async (req, res) => {
    const notes = await loadNotes();
    res.json(notes);
});

// Get a single note by title
app.get("/notes/:title", async (req, res) => {
    const title = req.params.title;

    const notes = await loadNotes();

    const note = notes.find(
        n => n.title.toLowerCase() === title.toLowerCase()
    );

    if (!note) {
        return res.status(404).json({
            error: `Note with title "${title}" not found`
        });
    }

    res.json(note);
});

// Upload image for a note
app.post("/notes/:title/image", upload.single('image'), async (req, res) => {
    const title = req.params.title;

    if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
    }

    const notes = await loadNotes();
    const note = notes.find(n => n.title.toLowerCase() === title.toLowerCase());

    if (!note) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(404).json({ error: `Note with title "${title}" not found` });
    }

    // Delete old image if exists
    if (note.image) {
        await fs.unlink(path.join(__dirname, "public", note.image)).catch(() => {});
    }

    note.image = `uploads/${req.file.filename}`;
    await saveNotes(notes);

    res.json({ message: "Image uploaded successfully", note });
});

// Delete a note by title
app.delete("/notes/:title", async (req, res) => {
    const title = req.params.title;

    const notes = await loadNotes();

    const index = notes.findIndex(
        n => n.title.toLowerCase() === title.toLowerCase()
    );

    if (index === -1) {
        return res.status(404).json({
            error: `Note with title "${title}" not found`
        });
    }

    const deleteNote = notes.splice(index, 1)[0];

    // Delete image if exists
    if (deleteNote.image) {
        await fs.unlink(path.join(__dirname, "public", deleteNote.image)).catch(() => {});
    }

    await saveNotes(notes);

    res.json({
        message: "Note deleted successfully!",
        note:deleteNote
    });
});

// Update a note by title
app.put("/notes/:title", async (req, res) => {
    const title = req.params.title;
    const { body } = req.body;

    // Validation
    if (!body) {
        return res.status(400).json({
            error: "New note body is required"
        });
    }

    const notes = await loadNotes();

    const note = notes.find(
        n => n.title.toLowerCase() === title.toLowerCase()
    );

    if (!note) {
        return res.status(404).json({
            error: `Note with title "${title}" not found`
        });
    }

    note.body = body;
    await saveNotes(notes);

    res.json({
        message: "Note updated successfully!",
        note:note
    });
});

// Error handler for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ error: error.message });
    } else if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});

app.listen(3000, async function () {
    await ensureUploadsDir();
    console.log('Note Organizer API is listening on port 3000!')
  });
