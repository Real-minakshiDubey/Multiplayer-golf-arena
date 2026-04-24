# Multiplayer Code Golf Arena ⛳

Welcome to **Multiplayer Code Golf Arena**! This is a real-time, competitive platform where developers go head-to-head to solve coding challenges using the shortest and most efficient code possible. "Code Golf" is a recreational programming competition where the goal is to achieve the shortest possible source code that implements a specific algorithm.

## 🚀 Features

### 1. Real-Time Multiplayer Matches
- **Live Room System:** Create private or public rooms to challenge friends or match up with other developers around the world.
- **WebSocket Synchronization:** Experience seamless real-time interactions, live leaderboards, and instant feedback during matches powered by Socket.IO.

### 2. Live Code Execution & Validation
- **Secure Sandboxing:** User-submitted code is securely executed and evaluated against multiple test cases in isolated, resource-constrained Docker containers.
- **In-Browser Code Editor:** Integrated Monaco Editor (the engine behind VS Code) provides a world-class coding experience right in the browser with syntax highlighting and auto-completion.

### 3. Tournaments & Competitive Play
- **Organized Events:** Join scheduled coding tournaments and climb the ranks.
- **Global Leaderboards:** Track your Elo rating, win rate, and shortest solutions globally across different programming languages.

### 4. User Profiles & Authentication
- **Secure Authentication:** JWT-based authentication system ensures your account and progress are safe.
- **Performance Analytics:** View your past match history, total wins, languages used, and your "golfed" submissions.

### 5. Replays & Learning
- **Match Replays:** Review past matches to study how other top players solved the exact same problems with even shorter code.
- **Problem Archive:** Access a repository of coding challenges to practice your golfing skills offline.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** [React 18](https://reactjs.org/) powered by [Vite](https://vitejs.dev/) for lightning-fast builds.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for beautiful, responsive, and utility-first styling.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid page transitions and interactive micro-animations.
- **Editor:** `@monaco-editor/react` for an authentic VS Code-like coding interface.
- **State & Routing:** React Router DOM, React Hot Toast for notifications, and Axios for API requests.

### **Backend**
- **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) for building robust REST APIs.
- **Real-Time Communication:** [Socket.IO](https://socket.io/) for bidirectional event-based communication between the server and the clients during live matches.
- **Code Execution:** Custom Docker-based execution engine to safely execute arbitrary code in isolated Alpine containers across various languages (JavaScript, Python, Ruby, PHP, etc.).
- **Authentication:** JSON Web Tokens (JWT) for secure, stateless user sessions.

### **Database**
- **Primary Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud NoSQL Database).
- **ODM:** [Mongoose](https://mongoosejs.com/) for structured data modeling (Users, Matches, Rooms, Submissions, Tournaments).

---

## 🔮 Future Enhancements

We are constantly looking to improve the Code Golf Arena experience. Here are some features on the roadmap:

1. **More Language Support:** Expanding Docker image support to include esoteric languages often used in Code Golf (like GolfScript, APL, or Brainfuck).
2. **AI-Powered Code Analysis:** Implementing an AI assistant that analyzes your code *after* the match to teach you built-in functions or language quirks that could have saved you bytes.
3. **Advanced Matchmaking System:** An Elo-based matchmaking queue that automatically pairs you with developers of similar skill levels.
4. **Custom Challenges:** Allowing verified community members to author, test, and publish their own Code Golf challenges for the community.
5. **Team-Based Relay Golf:** A new game mode where teams of developers take turns adding lines of code to solve a single problem cooperatively.
6. **Social Features:** Friend lists, direct messaging, and the ability to spectate live high-stakes matches.
7. **Gamification:** Unlockable badges, custom editor themes, and profile avatars earned by completing specific challenges or reaching Elo milestones.
