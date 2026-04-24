import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { rooms as socketRooms } from '../socket/index.js';

const router = Router();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GOLF-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

router.get('/', authenticate, (req, res) => {
  // Use in-memory socket rooms as the source of truth (not stale db.json)
  const liveRooms = [];
  for (const [code, room] of socketRooms.entries()) {
    if (room.status === 'waiting') {
      liveRooms.push({
        code: room.code,
        name: room.name,
        status: room.status,
        players: room.players,
        maxPlayers: room.maxPlayers,
        max_players: room.maxPlayers,
        roundTime: room.roundTime,
        round_time: room.roundTime,
        host_id: room.host?.id
      });
    }
  }
  res.json(liveRooms);
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, maxPlayers = 6, roundTime = 300, challengeId } = req.body;
    const code = generateRoomCode();

    const room = await db.createRoom({
      code,
      name: name || `${req.user.username}'s Room`,
      host_id: req.user.id,
      max_players: maxPlayers,
      round_time: roundTime,
      challenge_id: challengeId || null
    });

    res.json(room);
  } catch (err) {
    console.error('Room creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;