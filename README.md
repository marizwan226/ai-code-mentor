# 🤖 AI Code Mentor

An AI-powered platform to help developers learn and improve their code through intelligent code reviews, explanations, and mentoring.

![AI Code Mentor](https://img.shields.io/badge/version-1.0.0-blue)
![CI Pipeline](https://github.com/marizwan226/ai-code-mentor/actions/workflows/ci.yml/badge.svg)

## 🌐 Live Demo

- **Frontend:** https://ai-code-mentor-rose.vercel.app
- **Backend API:** https://ai-code-mentor-backend-jqsp.onrender.com
- **Health Check:** https://ai-code-mentor-backend-jqsp.onrender.com/health

## ✨ Features

- 💬 **AI Chat** — Ask technical questions and get expert answers
- 🔍 **Code Review** — Paste code and get structured AI feedback
- 💡 **Code Explanation** — Understand any code in plain English
- 📋 **Session History** — View and revisit past reviews and chats
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📱 **Responsive** — Works on mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (TypeScript)
- Tailwind CSS
- Monaco Editor
- Vercel (hosting)

### Backend
- Node.js + Express
- MongoDB Atlas
- Anthropic Claude via OpenRouter
- Render (hosting)

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/marizwan226/ai-code-mentor.git
cd ai-code-mentor
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
node app.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

### 4. Open Browser
Yes
## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | OpenRouter API key | ✅ |
| `JWT_SECRET` | Secret for JWT tokens | ✅ |
| `NODE_ENV` | `development` or `production` | ✅ |
| `MONGODB_URI` | MongoDB Atlas connection string | Production only |
| `PORT` | Server port (default: 5000) | Optional |
| `FRONTEND_URL` | Frontend URL for CORS | Optional |

### Frontend (`frontend/.env.local`)
| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |

## 📁 Project Structure
## 📋 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/signup` | Register user |
| POST | `/auth/login` | Login user |
| POST | `/api/chat` | Send chat message |
| POST | `/api/chat/stream` | Streaming chat |
| POST | `/api/chat/detect-language` | Detect language |
| GET | `/api/chat/languages` | List languages |
| GET | `/api/sessions` | Get all sessions |
| POST | `/api/sessions` | Save session |
| DELETE | `/api/sessions/:id` | Delete session |

## 🏗️ Development

### Run Tests
```bash
cd backend && npm test
cd frontend && npm run lint
```

### Build for Production
```bash
cd frontend && npm run build
```

## 📝 Changelog

### v1.0.0 (2026-05-28)
- ✅ AI chat interface with streaming responses
- ✅ Code review with structured feedback
- ✅ Code explanation in plain English
- ✅ Session history with persistent storage
- ✅ Language auto-detection (8 languages)
- ✅ Dark mode toggle
- ✅ Responsive sidebar navigation
- ✅ Welcome banner and onboarding
- ✅ Production deployment on Vercel + Render
- ✅ MongoDB Atlas persistent database

## 👨‍💻 Author

**Mariz** — Developer

## 📄 License

MIT License
