# ♚ Chess Master 2026

![App Hero Image](https://raw.githubusercontent.com/lichess-org/lila/master/public/images/piece/chesscom/wN.png)
*Designed and Developed by **Tashil***

## 🌟 The Ultimate Chess Experience
Chess Master 2026 is a state-of-the-art platform that combines high-performance engine analysis with a structured learning curriculum. Whether you're a absolute beginner or an aspiring grandmaster, This webapp provides the tools you need to excel.

## 🚀 Core Features

### 🤖 High-Performance AI Engine
Our backend is powered by a custom-built, thread-safe AI engine written in Python. 
- **Asynchronous Processing**: The engine runs in a dedicated thread pool. This means the UI never freezes, even when the AI is thinking 10+ moves ahead.
- **Minimax Algorithm**: Uses advanced search techniques with Alpha-Beta pruning for tactical precision.
- **Real-Time Evaluation Bar**: Watch the balance of power shift with our interactive evaluation bar that reflects engine insights every half-second.

### 🧭 Opening Explorer
Master the first phase of the game with our deep opening database.
- **3,000+ Openings**: Browse through the Encyclopedia of Chess Openings (ECO).
- **Interactive Practice**: Select any opening and start a practice game directly from that position.
- **Win Rates & Stats**: Analyze historical performance for every line to choose the best weapons for your repertoire.

### 🎓 Chess Academy
A revolutionary learning path with **18 comprehensive lessons** (6 per difficulty level).
- **Horizontal Navigation**: Easily switch between Beginner, Intermediate, and Master tracks.
- **Interactive Boards**: Every lesson features a live board preview where you can visualize the concepts being taught.
- **Deep Content**: Lessons cover everything from "How to move the Rook" to "The Lucena Position" and "Positional Sacrifices".

---

## 🛠 Technical Highlights
- **FastAPI Backend**: Rapid, non-blocking API endpoints for game state management.
- **TypeScript Frontend**: Robust, type-safe React code for a bug-free user experience.
- **Zustand State**: Ultra-fast state management for smooth board interactions.
- **Docker Ready**: Launch the entire environment with a single command.

---

## 📸 Application Showroom

### 🏠 Home Page
The command center of Chess Master 2026. Access all modes from a beautiful, glass-morphic interface.
![Home Page Screenshot](https://via.placeholder.com/800x450?text=Gravity+Home+Page+Redesign)

### ⚔️ Combat Zone (Play vs AI)
Pit your skills against our engine. Adjust difficulty on the fly and watch the evaluation bar.
![Play Mode Screenshot](https://via.placeholder.com/800x450?text=Real-time+AI+Combat+Zone)

### 🏢 Study Center
The theoretical heart of the app. Explorers and Academics alike find their home here.
![Study Center Screenshot](https://via.placeholder.com/800x450?text=Advanced+Opening+Explorer)

### 🎓 The Academy
A structured 6-card grid for each level, providing detailed insights into chess mastery.
![Academy Screenshot](https://via.placeholder.com/800x450?text=Interactive+Chess+Academy)

---

## 🛠 Quick Start

### 🐳 Docker Deployment
```bash
docker-compose up --build
```
*Frontend: http://localhost:3000 | API: http://localhost:8000*

### 💻 Local Setup
1. **Backend**: `pip install -r requirements.txt` then `python main.py`
2. **Frontend**: `npm install` then `npm start`

---
*Built with passion by **Tashil** [2026 Edition].*
