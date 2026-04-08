# 🚀 VocodeAI

> A Cloud-Based Coding Platform – Write, Run & Build Projects Without Installing Anything.

---

## 🌐 Overview

**VocodeAI** is a powerful cloud-based coding platform that allows users to write and execute code directly from the browser — without installing compilers, SDKs, or dependencies like C++, JDK, Python, etc.

It provides a **VS Code-like workspace environment** where users can:

- 📁 Create Workspaces
- 📂 Create Folders & Files
- 🧠 Write code using Monaco Editor
- ▶️ Run multi-language programs
- 💻 Use an integrated terminal
- 🐳 Execute code securely inside Docker containers
- 🌍 Build full-stack projects (MERN, MEAN, Spring Boot, etc.)

---

## ✨ Features

### 🖥️ Cloud IDE
- Monaco Editor (VS Code Editor Engine)
- Syntax Highlighting
- File Explorer like VS Code
- Folder & File Creation
- Real-time Editing
- Auto Scroll & Multi Tabs

### 💻 Multi-Language Support
Supports execution of:
- HTML
- CSS
- JavaScript
- Java
- C++
- C
- Python

### 🐳 Secure Code Execution
- Docker-based sandboxed execution
- Isolated containers for each user
- Secure runtime environment
- Background worker execution using BullMQ

### 🔐 Authentication & Security
- JWT Authentication
- Google OAuth 2.0
- Password Hashing (bcrypt)
- Cookie-based Auth
- Express Rate Limiting
- Helmet Security
- Email Verification (Nodemailer)

### 🖥️ Integrated Terminal
- xterm.js powered terminal
- node-pty backend
- WebSocket real-time communication
- Container-level shell access

---

## Images 
<img width="1000" height="400" alt="Screenshot 2026-03-22 123313" src="https://github.com/user-attachments/assets/08b1dbab-adc1-423e-8aa1-7af6da2b168a"/>
<img width="1000" height="400" alt="Screenshot 2026-03-22 123325" src="https://github.com/user-attachments/assets/12a94d9d-1bc0-48b9-96c4-e3c4bf359683" />
<img width="450" height="500" alt="Screenshot 2026-03-22 123336" src="https://github.com/user-attachments/assets/477d89cb-d6d5-44ed-820a-6263dcd9f523" />
<img width="1000" height="500" alt="Screenshot 2026-03-22 124042" src="https://github.com/user-attachments/assets/e7f95754-f5c7-4b28-9731-109f44c51b0c" />
<img width="1000" height="500" alt="Screenshot 2026-03-22 123751" src="https://github.com/user-attachments/assets/c1243964-ee58-4547-bbfb-d5b7fa3f96f1" />

## 📁 Project Structure
```
VocodeAI/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── docker/
│ ├── middleware/
│ ├── models/
│ ├── projects/
│ ├── queue/
│ ├── routes/
│ ├── sandbox/
│ ├── services/
│ ├── utils/
│ ├── workers/
│ ├── workspaces/
│ ├── server.js
│ └── terminalServer.js
│
└── frontend/
├── public/
├── src/
│ ├── assets/
│ ├── auth/
│ ├── components/
│ ├── config/
│ ├── context/
│ ├── pages/
│ ├── services/
│ ├── styles/
│ ├── utils/
│ ├── App.jsx
│ └── main.jsx

```

## 🛠️ Tech Stack

### 🔹 Frontend
- React 19
- Vite (Rolldown Vite)
- Tailwind CSS
- Monaco Editor
- React Router v7
- Axios
- JWT Decode
- xterm.js

### 🔹 Backend
- Node.js (ES Modules)
- Express 5
- MongoDB (Mongoose)
- Redis (ioredis)
- BullMQ
- Dockerode
- WebSocket (ws)
- node-pty
- Passport.js (Google OAuth)
- JWT
- Nodemailer

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash

git clone https://github.com/your-username/VocodeAI.git
cd VocodeAI

```

 ### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
### 🔌 Environment Requirements
 - Node.js v18+
 - MongoDB
 - Redis
 - Docker
 - npm

### ⚙️ How Code Execution Works
 - User writes code in Monaco Editor
 - Code is sent to backend
 - Job is added to BullMQ queue
 - Worker picks the job
 - Docker container is created
 - Code is executed securely inside the container
 - Output is returned via WebSocket

### 📡 Real-Time Terminal
 - xterm.js (Frontend)
 - node-pty (Backend)
 - WebSocket Communication
 - Container-level Shell Access

### 📈 Future Improvements
 - 🤝 Collaborative Coding
 - 🤖 AI Code Assistant
 - 🔄 Git Integration
 - 📦 Project Templates
 - ☁️ Deployment Integration
 - 🎨 Dark/Light Themes

### 🧑‍💻 Author
```
  Saksham Agarwal
  Full Stack Developer
  MERN | Docker | Redis | System Design | Cloud Platforms
```
### 🤝 Contributing
 - Fork the repository
 - Create your feature branch (git checkout -b feature/AmazingFeature)
 - Commit your changes (git commit -m 'Add some AmazingFeature')
 - Push to the branch (git push origin feature/AmazingFeature)
 - Open a Pull Request

### 📜 License
Licensed under the ISC License.

### ⭐ Support
 - If you like this project:
 - ⭐ Star the repository
 - 🍴 Fork it
 - 🛠️ Contribute

### 💡 Vision
VocodeAI aims to become a complete cloud development environment where anyone can code, build, test, and deploy applications directly from the browser — without worrying about system setup.
