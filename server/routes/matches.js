import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

// Get all matches (most recent first)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const matches = await db.getMatches(limit);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single match detail
router.get('/:id', async (req, res) => {
  try {
    const match = await db.getMatchById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
