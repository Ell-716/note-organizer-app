# 🗒️ Note Organizer App

A full-stack note-taking application with a dark editorial UI. Built with **Node.js + Express** backend and vanilla JavaScript frontend.

Notes are stored in a local JSON file and support full CRUD operations through both a REST API and web interface.

## ✨ Features

- **Web Interface**: Clean, dark blue editorial theme with modal dialogs
- **Add Notes**: Create new notes with title and content
- **Edit Notes**: Update existing note content
- **Delete Notes**: Remove notes with confirmation
- **Image Upload**: Attach images to notes (5MB limit, auto-replaces old images)
- **Persistent Storage**: All notes and images saved locally
- **Unique Titles**: Enforces unique note titles (case-insensitive)
- **Timestamps**: Automatically tracks creation time
- **Toast Notifications**: User feedback for all actions
- **Responsive Design**: Modern UI with smooth animations

## 🧱 Tech Stack

**Backend:**
- Node.js
- Express
- Multer (file uploads)
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
│   ├── uploads/          # Auto-generated, stores uploaded images
│   ├── index.html
│   ├── app.js
│   └── style.css
├── note_app.js
├── notes.json            # Auto-generated note storage
├── package.json
├── .gitignore
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

### 🖼️ Upload Image to Note

**POST** `/notes/:title/image`

```bash
curl -X POST http://localhost:3000/notes/Shopping/image \
  -F "image=@/path/to/image.jpg"
```

**Constraints:**
- Maximum file size: 5MB
- Allowed types: Images only (jpg, png, gif, svg, etc.)
- Uploading a new image replaces the existing one
- Image is deleted when the note is deleted

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
  "time_added": "2023-08-01T08:30:00Z",
  "image": "uploads/note-1738392047234-x7k2m9p.jpg"
}
```

The `image` field is optional and only present when an image has been uploaded.

## 🎨 UI Features

- **Dark Blue Theme**: Editorial-style interface with `#02023c` background
- **Modal Dialogs**: Smooth animations for adding/editing notes
- **Note Cards**: Hover effects with actions (edit/delete)
- **Image Zones**: Click to upload or replace note images
- **Empty State**: Helpful message when no notes exist
- **Keyboard Support**: ESC key to close modals

## 🧠 Notes

- Titles are matched **case-insensitively**
- Duplicate titles are prevented (409 response)
- Data persists between server restarts
- `notes.json` and `public/uploads/` are created automatically if they don't exist
- Title cannot be changed after creation (only body can be updated)
- Images are stored with unique filenames to prevent conflicts
- Old images are automatically deleted when replaced or when a note is deleted
