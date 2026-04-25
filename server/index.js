import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import challengeRoutes from './routes/challenges.js';
import roomRoutes from './routes/rooms.js';
import userRoutes from './routes/users.js';
import submissionRoutes from './routes/submissions.js';
import matchRoutes from './routes/matches.js';
import tournamentRoutes from './routes/tournaments.js';
import aiRoutes from './routes/ai.js';
import { setupSocket } from './socket/index.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));
app.use(express.json());

// Start Server
const startServer = async () => {
  try {
    // Init database
    await initDB();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/challenges', challengeRoutes);
    app.use('/api/rooms', roomRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/submissions', submissionRoutes);
    app.use('/api/matches', matchRoutes);
    app.use('/api/tournaments', tournamentRoutes);
    app.use('/api/ai', aiRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'alive', message: '⚔️ ByteBattle Server' });
    });

    // Socket.io
    setupSocket(io);

    const PORT = process.env.PORT || 3001;
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use. Kill the old process first:\n   taskkill /F /IM node.exe\n`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
    server.listen(PORT, () => {
      console.log(`\n⚔️ ByteBattle Server running on port ${PORT}\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();