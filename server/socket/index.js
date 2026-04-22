import jwt from 'jsonwebtoken';
import { handleRoom } from './roomHandler.js';
import { handleGame } from './gameHandler.js';

// In-memory room state
export const rooms = new Map();

export function setupSocket(io) {
  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ ${socket.user.username} connected`);

    handleRoom(io, socket);
    handleGame(io, socket);

    socket.on('disconnect', () => {
      console.log(`❌ ${socket.user.username} disconnected`);

      // Remove from any room
      for (const [roomCode, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex(p => p.id === socket.user.id);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          io.to(roomCode).emit('player-left', {
            userId: socket.user.id,
            players: room.players
          });

          if (room.players.length === 0) {
            rooms.delete(roomCode);
          }
        }
      }
    });
  });
}