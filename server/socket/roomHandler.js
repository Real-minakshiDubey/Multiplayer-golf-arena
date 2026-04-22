import { rooms } from './index.js';

export function handleRoom(io, socket) {

  socket.on('create-room', ({ roomCode, roomName, maxPlayers, roundTime, challengeId }, callback) => {
    const room = {
      code: roomCode,
      name: roomName,
      host: socket.user,
      players: [{
        id: socket.user.id,
        username: socket.user.username,
        avatar: socket.user.avatar,
        ready: false,
        score: null
      }],
      status: 'waiting',
      maxPlayers: maxPlayers || 6,
      roundTime: roundTime || 300,
      challengeId: challengeId || null,
      challenge: null,
      submissions: {},
      startTime: null
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);

    callback({ success: true, room });
    console.log(`🏠 Room ${roomCode} created by ${socket.user.username}${challengeId ? ` [Challenge: ${challengeId}]` : ''}`);
  });

  socket.on('join-room', ({ roomCode }, callback) => {
    const room = rooms.get(roomCode);

    if (!room) return callback({ success: false, error: 'Room not found' });
    if (room.status !== 'waiting') return callback({ success: false, error: 'Game already started' });
    if (room.players.length >= room.maxPlayers) return callback({ success: false, error: 'Room is full' });
    if (room.players.find(p => p.id === socket.user.id)) {
      // Already in room - return success with room data (needed when navigating to GameRoom page)
      socket.join(roomCode);
      return callback({ success: true, room });
    }

    const player = {
      id: socket.user.id,
      username: socket.user.username,
      avatar: socket.user.avatar,
      ready: false,
      score: null
    };

    room.players.push(player);
    socket.join(roomCode);

    io.to(roomCode).emit('player-joined', { player, players: room.players });
    callback({ success: true, room });

    console.log(`👤 ${socket.user.username} joined room ${roomCode}`);
  });

  socket.on('leave-room', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.user.id);
    socket.leave(roomCode);

    io.to(roomCode).emit('player-left', {
      userId: socket.user.id,
      players: room.players
    });

    if (room.players.length === 0) {
      rooms.delete(roomCode);
    }
  });

  socket.on('toggle-ready', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.user.id);
    if (player) {
      player.ready = !player.ready;
      io.to(roomCode).emit('player-updated', { players: room.players });
    }
  });

  socket.on('chat-message', ({ roomCode, message }) => {
    io.to(roomCode).emit('chat-message', {
      userId: socket.user.id,
      username: socket.user.username,
      avatar: socket.user.avatar,
      message,
      timestamp: Date.now()
    });
  });
}