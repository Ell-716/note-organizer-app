const fs = require("fs");
const readline = require("readline-sync");

// Load existing notes
let notes = [];

if (fs.existsSync("notes.json")) {
  const data = fs.readFileSync("notes.json", "utf8");
  notes = JSON.parse(data);
}

// Ask user for input
const title = readline.question("Enter note title: ");
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

console.log("Note added successfully!\n");

// List all notes
if (notes.length === 0) {
  console.log("No notes found.");
} else {
  for (let i = 0; i < notes.length; i++) {
    console.log(`${i + 1}. Title: ${notes[i].title}`);
    console.log(`   Body: ${notes[i].body}`);
    console.log(`   Added on: ${notes[i].time_added}\n`);
  }
}
