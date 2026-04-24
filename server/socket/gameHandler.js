import { rooms } from './index.js';
import { challenges } from '../data/challenges.js';
import { validateSolution } from '../services/codeExecutor.js';
import { db } from '../config/db.js';
import { v4 as uuid } from 'uuid';

export function handleGame(io, socket) {

  socket.on('start-game', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    if (room.host.id !== socket.user.id) return;
    if (room.players.length < 1) return;

    // Use locked challenge if set, otherwise pick random
    let challenge;
    if (room.challengeId) {
      challenge = challenges.find(c => c.id === room.challengeId);
    }
    if (!challenge) {
      challenge = challenges[Math.floor(Math.random() * challenges.length)];
    }
    room.challenge = challenge;
    room.status = 'playing';
    room.startTime = Date.now();
    room.submissions = {};

    const safeChallenge = {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      examples: challenge.examples,
      inputFormat: challenge.inputFormat,
      outputFormat: challenge.outputFormat
    };

    io.to(roomCode).emit('game-started', {
      challenge: safeChallenge,
      roundTime: room.roundTime,
      startTime: room.startTime
    });

    setTimeout(async () => {
      if (room.status === 'playing') {
        await endGame(io, room, roomCode);
      }
    }, room.roundTime * 1000);

    console.log(`🎮 Game started in ${roomCode} — Challenge: ${challenge.title}`);
  });

  socket.on('submit-code', async ({ roomCode, code, language }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'playing') return;

    const charCount = code.replace(/\s/g, '').length;

    io.to(roomCode).emit('player-submitting', {
      userId: socket.user.id,
      username: socket.user.username
    });

    try {
      const { allPassed, results } = await validateSolution(
        code,
        language,
        room.challenge.testCases
      );

      const submission = {
        userId: socket.user.id,
        username: socket.user.username,
        avatar: socket.user.avatar,
        code,
        language,
        charCount,
        passed: allPassed,
        results,
        timestamp: Date.now()
      };

      if (!room.submissions[socket.user.id]) {
        room.submissions[socket.user.id] = [];
      }
      room.submissions[socket.user.id].push(submission);

      // Save to MongoDB
      await db.createSubmission({
        user_id: socket.user.id,
        challenge_id: room.challenge.id,
        room_id: roomCode,
        code,
        language,
        char_count: charCount,
        passed: allPassed
      });

      socket.emit('submission-result', {
        passed: allPassed,
        charCount,
        results
      });

      const leaderboard = buildLeaderboard(room);
      io.to(roomCode).emit('leaderboard-update', { leaderboard });

      if (allPassed) {
        io.to(roomCode).emit('player-solved', {
          userId: socket.user.id,
          username: socket.user.username,
          charCount
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
      socket.emit('submission-result', {
        passed: false,
        charCount,
        results: [],
        error: 'Execution failed'
      });
    }
  });

  socket.on('run-code', async ({ roomCode, code, language }, callback) => {
    const room = rooms.get(roomCode);
    if (!room || !room.challenge) {
      return callback({ allPassed: false, results: [], charCount: 0 });
    }

    try {
      const exampleTests = room.challenge.examples.map(e => ({
        input: e.input,
        expected: e.output
      }));

      const { allPassed, results } = await validateSolution(code, language, exampleTests);
      callback({
        allPassed,
        results,
        charCount: code.replace(/\s/g, '').length
      });
    } catch (err) {
      callback({ allPassed: false, results: [], charCount: 0, error: err.message });
    }
  });

  socket.on('force-end', async ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.host.id !== socket.user.id) return;
    await endGame(io, room, roomCode);
  });
}

function buildLeaderboard(room) {
  const board = [];

  for (const player of room.players) {
    const subs = room.submissions[player.id] || [];
    const passedSubs = subs.filter(s => s.passed);

    if (passedSubs.length > 0) {
      const best = passedSubs.reduce((a, b) => a.charCount < b.charCount ? a : b);
      board.push({
        userId: player.id,
        username: player.username,
        avatar: player.avatar,
        charCount: best.charCount,
        language: best.language,
        solved: true,
        attempts: subs.length
      });
    } else {
      board.push({
        userId: player.id,
        username: player.username,
        avatar: player.avatar,
        charCount: null,
        language: null,
        solved: false,
        attempts: subs.length
      });
    }
  }

  board.sort((a, b) => {
    if (a.solved && !b.solved) return -1;
    if (!a.solved && b.solved) return 1;
    if (a.solved && b.solved) return a.charCount - b.charCount;
    return 0;
  });

  return board;
}

async function endGame(io, room, roomCode) {
  room.status = 'finished';
  const leaderboard = buildLeaderboard(room);

  // Update stats
  if (leaderboard.length > 0 && leaderboard[0].solved) {
    const winnerId = leaderboard[0].userId;
    await db.incrementUserField(winnerId, 'games_won', 1);
    await db.incrementUserField(winnerId, 'elo', 25);
  }

  for (const player of room.players) {
    await db.incrementUserField(player.id, 'games_played', 1);
  }

  const solutions = {};
  for (const [userId, subs] of Object.entries(room.submissions)) {
    const passedSubs = subs.filter(s => s.passed);
    if (passedSubs.length > 0) {
      const best = passedSubs.reduce((a, b) => a.charCount < b.charCount ? a : b);
      solutions[userId] = {
        code: best.code,
        language: best.language,
        charCount: best.charCount
      };
    }
  }

  io.to(roomCode).emit('game-ended', {
    leaderboard,
    solutions,
    challenge: room.challenge
  });

  // Save match record for replays
  await db.createMatch({
    room_code: roomCode,
    room_name: room.name,
    challenge: {
      id: room.challenge.id,
      title: room.challenge.title,
      description: room.challenge.description,
      difficulty: room.challenge.difficulty
    },
    players: room.players.map(p => ({
      id: p.id,
      username: p.username,
      avatar: p.avatar
    })),
    leaderboard,
    solutions,
    duration: Math.floor((Date.now() - room.startTime) / 1000),
    winner: leaderboard.length > 0 && leaderboard[0].solved ? {
      id: leaderboard[0].userId,
      username: leaderboard[0].username,
      avatar: leaderboard[0].avatar,
      charCount: leaderboard[0].charCount
    } : null
  });

  console.log(`🏁 Game ended in ${roomCode} — Match saved`);

  setTimeout(() => rooms.delete(roomCode), 300000);
}