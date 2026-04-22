import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { v4 as uuid } from 'uuid';
import { challenges } from '../data/challenges.js';

const router = Router();

// Get all tournaments
router.get('/', (req, res) => {
  const tournaments = db.getTournaments();
  res.json(tournaments);
});

// Get single tournament
router.get('/:id', (req, res) => {
  const tournament = db.getTournamentById(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  res.json(tournament);
});

// Create tournament
router.post('/', authenticate, (req, res) => {
  const { name, description, maxPlayers = 16, roundTime = 300, numRounds = 3, startDate } = req.body;

  // Pick random challenges for rounds
  const shuffled = [...challenges].sort(() => Math.random() - 0.5);
  const roundChallenges = shuffled.slice(0, numRounds).map(c => ({
    id: c.id,
    title: c.title,
    difficulty: c.difficulty
  }));

  const tournament = db.createTournament({
    id: uuid(),
    name: name || `${req.user.username}'s Tournament`,
    description: description || 'Code Golf Tournament — shortest code wins!',
    status: 'upcoming', // upcoming | active | completed
    host_id: req.user.id,
    host_name: req.user.username,
    max_players: maxPlayers,
    round_time: roundTime,
    num_rounds: numRounds,
    start_date: startDate || new Date(Date.now() + 86400000).toISOString(), // default: tomorrow
    players: [{
      id: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar
    }],
    rounds: roundChallenges.map((c, i) => ({
      round_number: i + 1,
      challenge_id: c.id,
      challenge_title: c.title,
      challenge_difficulty: c.difficulty,
      status: 'pending', // pending | active | completed
      results: []
    })),
    current_round: 0,
    standings: [],
    elo_pool: maxPlayers * 15 // ELO prize pool
  });

  res.json(tournament);
});

// Register for tournament
router.post('/:id/register', authenticate, (req, res) => {
  const tournament = db.getTournamentById(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  if (tournament.status !== 'upcoming') return res.status(400).json({ error: 'Registration closed' });
  if (tournament.players.length >= tournament.max_players) return res.status(400).json({ error: 'Tournament full' });
  if (tournament.players.find(p => p.id === req.user.id)) return res.status(400).json({ error: 'Already registered' });

  tournament.players.push({
    id: req.user.id,
    username: req.user.username,
    avatar: req.user.avatar
  });

  db.updateTournament(tournament.id, { players: tournament.players });
  res.json(tournament);
});

// Unregister from tournament
router.post('/:id/unregister', authenticate, (req, res) => {
  const tournament = db.getTournamentById(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  if (tournament.status !== 'upcoming') return res.status(400).json({ error: 'Cannot unregister after start' });

  tournament.players = tournament.players.filter(p => p.id !== req.user.id);
  db.updateTournament(tournament.id, { players: tournament.players });
  res.json(tournament);
});

export default router;
