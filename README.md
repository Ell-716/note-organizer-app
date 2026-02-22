# 🗒️ Note Organizer App

A full-stack note-taking application with a dark editorial UI. Built with **Node.js + Express** backend and vanilla JavaScript frontend.

Notes are stored in a local JSON file and support full CRUD operations through both a REST API and web interface.

## ✨ Features

- **Web Interface**: Clean, dark blue editorial theme with modal dialogs
- **Add Notes**: Create new notes with title and content
- **Edit Notes**: Update existing note content
- **Delete Notes**: Remove notes with confirmation
- **Persistent Storage**: All notes saved to `notes.json`
- **Unique Titles**: Enforces unique note titles (case-insensitive)
- **Timestamps**: Automatically tracks creation time
- **Toast Notifications**: User feedback for all actions
- **Responsive Design**: Modern UI with smooth animations

## 🧱 Tech Stack

**Backend:**
- Node.js
- Express
- File system (`fs.promises`)
- JSON storage

**Frontend:**
- Vanilla JavaScript
- HTML5
- CSS3 (custom properties, animations)
- Fetch API

## 📁 Project Structure
```
note-organizer-app/
│
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
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

```
Note Organizer API is listening on port 3000!
```

### 4️⃣ Open the app

Visit **http://localhost:3000** in your browser to use the web interface.

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

## 🎨 UI Features

- **Dark Blue Theme**: Editorial-style interface with `#02023c` background
- **Modal Dialogs**: Smooth animations for adding/editing notes
- **Note Cards**: Hover effects with actions (edit/delete)
- **Empty State**: Helpful message when no notes exist
- **Keyboard Support**: ESC key to close modals

## 🧠 Notes

- Titles are matched **case-insensitively**
- Duplicate titles are prevented (409 response)
- Data persists between server restarts
- `notes.json` is created automatically if it doesn't exist
- Title cannot be changed after creation (only body can be updated)
