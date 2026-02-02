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

    // Read a note by title
    case "3": {
      const searchTitle = readline.question("\nEnter note title: ");

      // Find the note
      const note = notes.find(
        n => n.title.toLowerCase() === searchTitle.toLowerCase()
      );

      if (note) {
        console.log(`\nTitle: ${note.title}`);
        console.log(`Body: ${note.body}`);
        console.log(`Added on: ${note.time_added}`);
      } else {
        console.log(`\nNote with title "${searchTitle}" not found.`);
      }
      break;
    }

    // Delete a note by title
    case "4": {
      const deleteTitle = readline.question("\nEnter note title: ");

      // Find the note index
      const index = notes.findIndex(
        n => n.title.toLowerCase() === deleteTitle.toLowerCase()
      );

      if (index !== -1) {
        notes.splice(index, 1); // Remove the note from the array
        fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2)); // Save updated array
        console.log("\nNote deleted successfully!");
      } else {
        console.log(`\nNote with title "${deleteTitle}" not found.`);
      }
      break;
    }

    // Update a note by title
    case "5": {
      const updateTitle = readline.question("\nEnter note title: ");

      // Find the note
      const note = notes.find(
        n => n.title.toLowerCase() === updateTitle.toLowerCase()
      );

      if (note) {
        const newBody = readline.question("Enter new note body: ");
        note.body = newBody; // Update the body, keep time_added unchanged
        fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2)); // Save updated array
        console.log("\nNote updated successfully!");
      } else {
        console.log(`\nNote with title "${updateTitle}" not found.`);
      }
      break;
    }

    // Exit
    case "6":
      console.log("\nGoodbye!");
      process.exit(0);

    // Invalid input
    default:
      console.log("\nInvalid choice. Try again.");
  }
}
