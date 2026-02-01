const fs = require("fs");
const readline = require("readline-sync");

let notes = [];

if (fs.existsSync("notes.json")) {
  const data = fs.readFileSync("notes.json", "utf8");
  notes = JSON.parse(data);
}

const title = readline.question("Enter note title: ");
const body = readline.question("Enter note body: ");

const newNote = {
  title: title,
  body: body,
  time_added: new Date().toISOString()
};

notes.push(newNote);

fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));

console.log("Note added successfully!");
