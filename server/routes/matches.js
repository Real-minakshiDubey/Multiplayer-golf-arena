import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

// Get all matches (most recent first)
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const matches = db.getMatches(limit);
  res.json(matches);
});

// Get single match detail
router.get('/:id', (req, res) => {
  const match = db.getMatchById(req.params.id);
  if (!match) return res.status(404).json({ error: 'Match not found' });
  res.json(match);
});

export default router;
