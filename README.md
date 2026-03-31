# SampleRate Audio — Browser-Based Audio Recording Studio

A production-ready, full-stack web application for browser-based audio recording with React.js frontend and Node.js + Express.js backend.

## Features

- 🔐 **User Authentication** — JWT-based register/login
- 🎙️ **Audio Recording** — Browser microphone via MediaRecorder API
- ⏯️ **Full Controls** — Start, stop, pause, resume, re-record, playback
- 📊 **Live Waveform** — Real-time visualizer using Web Audio API
- 💾 **Local Persistence** — IndexedDB storage before upload (no data loss)
- ☁️ **Upload to Server** — Multipart upload with progress tracking
- 📁 **Recording History** — Paginated list with playback and delete
- 📱 **Responsive UI** — Mobile-first dark theme design
- 🏗️ **Clean Architecture** — SOLID principles, MVC + service layer

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React.js, Redux Toolkit, React Router, Axios, React Hook Form |
| Backend  | Node.js, Express.js, MongoDB, Mongoose, JWT, Multer |
| Storage  | MongoDB (metadata), Disk (audio files), IndexedDB (local) |
| Design   | Custom CSS, Dark theme, Glassmorphism, Inter font |

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone and install

```bash
# Backend
cd backend
cp .env.example .env    # Edit with your MongoDB URI and JWT secret
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Start development servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm start
```

### 3. Open in browser

Navigate to `http://localhost:3000`

## API Endpoints

| Method   | Endpoint         | Auth | Description           |
|----------|-----------------|------|-----------------------|
| `POST`   | `/api/auth/register` | No   | Register new user     |
| `POST`   | `/api/auth/login`    | No   | Login, get JWT token  |
| `GET`    | `/api/auth/me`       | Yes  | Get user profile      |
| `POST`   | `/api/audio/upload`  | Yes  | Upload audio + metadata |
| `GET`    | `/api/audio/history` | Yes  | Paginated history     |
| `GET`    | `/api/audio/:id`     | Yes  | Single recording      |
| `GET`    | `/api/audio/:id/stream` | Yes | Stream audio file    |
| `DELETE` | `/api/audio/:id`     | Yes  | Delete recording      |

## Project Structure

```
sampleRate-Audio-project/
├── frontend/                     # React.js application
│   └── src/
│       ├── components/           # Reusable UI components
│       │   ├── audio/            # AudioRecorder, Player, Waveform, Controls
│       │   ├── common/           # Button, Input, Modal, Spinner, Toast
│       │   └── history/          # HistoryCard, HistoryList
│       ├── constants/            # API, audio config, route paths
│       ├── hooks/                # useAudioRecorder, useAuth, useIndexedDB
│       ├── layouts/              # AuthLayout, MainLayout
│       ├── pages/                # Login, Register, Dashboard, Record, History
│       ├── routes/               # AppRouter, ProtectedRoute
│       ├── services/             # Axios API client, auth, audio, IndexedDB
│       ├── store/slices/         # Redux: auth, audio, upload, ui
│       └── utils/                # Formatters, validators
│
├── backend/                      # Express.js API server
│   └── src/
│       ├── config/               # Database, env, multer
│       ├── controllers/          # Auth, Audio request handlers
│       ├── middleware/            # Auth guard, error handler, validation
│       ├── models/               # Mongoose: User, AudioRecord
│       ├── repositories/         # Data access layer
│       ├── routes/               # Express route definitions
│       ├── services/             # Business logic layer
│       ├── validators/           # Express-validator schemas
│       └── utils/                # API response, logger, token helper
```

## Audio Recording Flow

```
Login → Dashboard → Record → Preview → Name File → Save Local → Upload → History
```

1. User logs in or registers
2. Navigates to Record page
3. Grants microphone permission
4. Starts recording (live waveform + timer)
5. Stops and previews playback
6. Enters file name and metadata
7. Saves locally to IndexedDB (offline safety)
8. Uploads to backend with progress bar
9. Appears in recording history

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/samplerate-audio
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=52428800
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment Notes

- Set `NODE_ENV=production` in backend
- Build frontend: `cd frontend && npm run build`
- Serve frontend build with Nginx or Express static
- Use HTTPS in production (required for MediaRecorder API)
- Use MongoDB Atlas for cloud database
- Set a strong `JWT_SECRET` in production

## License

ISC
