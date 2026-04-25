import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// Get all challenges (without test cases for security)
router.get('/', async (req, res) => {
  try {
    const challenges = await db.getChallenges();
    const list = challenges.map(c => {
      // Handle both Mongoose docs and plain objects
      const obj = c.toObject ? c.toObject() : c;
      const { testCases, ...rest } = obj;
      return rest;
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single challenge
router.get('/:id', async (req, res) => {
  try {
    const challenge = await db.getChallengeById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Not found' });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new challenge
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, category, inputFormat, outputFormat, examples, testCases } = req.body;

    if (!title || !description || !difficulty || !testCases || testCases.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate a URL-friendly ID from the title
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if ID already exists
    const existing = await db.getChallengeById(id);
    if (existing) {
      return res.status(400).json({ error: 'A challenge with a similar title already exists' });
    }

    const challenge = await db.createChallenge({
      id,
      title,
      description,
      difficulty,
      category,
      inputFormat,
      outputFormat,
      examples,
      testCases,
      created_by: req.user.id
    });

    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a challenge (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const deleted = await db.deleteChallenge(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Challenge not found' });
    res.json({ message: 'Challenge deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;