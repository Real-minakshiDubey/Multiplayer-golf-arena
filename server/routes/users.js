import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { password, ...safeUser } = user;
  res.json(safeUser);
});

router.get('/leaderboard', (req, res) => {
  const leaderboard = db.getLeaderboard(50);
  res.json(leaderboard);
});

export default router;