# Quiz-App
SPA quiz web app developed with React

web-based quiz game platform built as a Single Page Application (SPA) using **React**, **Tailwind CSS**, and **Material UI**. It allows administrators to create, edit, and manage quiz games, and lets users join game sessions to participate in real-time quizzes.

---

## 🔧 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Material UI
- **Backend**: Provided API (hosted at `http://localhost:5005`)
- **Routing**: React Router DOM
- **State Management**: React Hooks and Context API

---

## 🚀 Features

### 👩‍💼 Admin Functionality

- Register & log in
- Create new games with:
  - Title
  - Multiple questions (2–6 answers per question)
  - Time limit, points, and thumbnail support
- Edit existing games:
  - Update questions, answers, metadata
  - Upload custom image or YouTube video for each question
- Start and stop live game sessions
- View detailed results per session (correct answers, player scores)

### 🙋 Player Functionality

- Join game sessions via session ID
- Answer quiz questions in real time
- View final score upon game completion
