import { Router } from 'express';
import { challenges } from '../data/challenges.js';

const router = Router();

router.get('/', (req, res) => {
  const list = challenges.map(({ testCases, ...rest }) => rest);
  res.json(list);
});

router.get('/:id', (req, res) => {
  const challenge = challenges.find(c => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Not found' });
  res.json(challenge);
});

router.get('/random/:difficulty', (req, res) => {
  const filtered = challenges.filter(c => c.difficulty === req.params.difficulty);
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  res.json(random);
});

export default router;