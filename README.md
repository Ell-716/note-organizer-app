# 🗒️ Note Organizer API

A simple **Node.js + Express REST API** for managing notes.
Notes are stored in a local JSON file and support full CRUD operations.

This project started as a command-line app and was later refactored into an API.

## ✨ Features

- Add a note
- List all notes
- Read a note by title
- Update a note
- Delete a note
- Persistent storage using `notes.json`

## 🧱 Tech Stack

- Node.js
- Express
- File system (`fs`)
- JSON storage

## 📁 Project Structure
```pgsql 
note-organizer-app/
│
├── note_app.js
├── notes.json
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Ell-716/note-organizer-app.git
cd note-organizer-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start the server

```bash
node note_app.js
```

You should see:

```csharp
Note Organizer API is listening on port 3000!
```

## 📌 API Endpoints

### ➕ Add a Note

**POST** `/notes`

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Shopping","body":"Buy milk and bread"}'
  ```

### 📄 Get All Notes

**GET** `/notes`

```bash
curl http://localhost:3000/notes
```

### 🔍 Get a Note by Title

**GET** `/notes/:title``

```bash
curl http://localhost:3000/notes/Shopping
```

### ✏️ Update a Note

**PUT** `/notes/:title``

```bash
curl -X PUT http://localhost:3000/notes/Shopping \
  -H "Content-Type: application/json" \
  -d '{"body":"Buy milk, bread, and eggs"}'
```

`time_added` remains unchanged.

### ❌ Delete a Note

**DELETE** `/notes/:title`

```bash
curl -X DELETE http://localhost:3000/notes/Shopping
```

## 🗃️ Note Format

Each note is stored as an object:

```json
{
  "title": "Shopping",
  "body": "Buy milk and bread",
  "time_added": "2023-08-01T08:30:00Z"
}
```

## 🧠 Notes

- Titles are matched **case-insensitively**
- Data persists between server restarts
- `notes.json` is created automatically if it doesn’t exist
