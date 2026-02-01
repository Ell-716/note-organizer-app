const fs = require("fs");
const readline = require("readline-sync");

// Load existing notes
let notes = [];

if (fs.existsSync("notes.json")) {
  const data = fs.readFileSync("notes.json", "utf8");
  notes = JSON.parse(data);
}

// Main menu loop
while (true) {
  console.log("\n--- Note Organizer Menu ---");
  console.log("1. Add a note");
  console.log("2. List all notes");
  console.log("3. Read a note (by title)");
  console.log("4. Delete a note");
  console.log("5. Update a note");
  console.log("6. Exit");

  const choice = readline.question("Enter your choice: ");

  switch (choice) {
    // Add a note
    case "1": {
      // Ask user for input
      const title = readline.question("\nEnter note title: ");
      const body = readline.question("Enter note body: ");

      // Create a new note
      const newNote = {
        title: title,
        body: body,
        time_added: new Date().toISOString()
      };

      // Add & save
      notes.push(newNote);
      fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));
      console.log("\nNote added successfully!");
      break;
    }

    // List all notes
    case "2": {
      if (notes.length === 0) {
        console.log("\nNo notes found.");
      } else {
        for (let i = 0; i < notes.length; i++) {
          console.log(`\n${i + 1}. Title: ${notes[i].title}`);
          console.log(`   Body: ${notes[i].body}`);
          console.log(`   Added on: ${notes[i].time_added}\n`);
        }
      }
      break;
    }

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
