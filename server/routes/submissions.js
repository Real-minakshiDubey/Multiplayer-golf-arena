import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { validateSolution } from '../services/codeExecutor.js';
import { challenges } from '../data/challenges.js';
import { v4 as uuid } from 'uuid';

const router = Router();

// Get current user's submissions
router.get('/me', authenticate, (req, res) => {
  const submissions = db.getSubmissionsByUser(req.user.id);
  res.json(submissions);
});

// Get solved challenge IDs for current user
router.get('/solved', authenticate, (req, res) => {
  const solvedIds = db.getSolvedChallengeIds(req.user.id);
  res.json(solvedIds);
});

// Get best submission for a specific challenge
router.get('/best/:challengeId', authenticate, (req, res) => {
  const best = db.getBestSubmission(req.user.id, req.params.challengeId);
  res.json(best);
});

// Submit practice solution
router.post('/practice', authenticate, async (req, res) => {
  const { code, language, challengeId } = req.body;

  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  try {
    const { allPassed, results } = await validateSolution(
      code, language, challenge.testCases
    );

    const charCount = code.replace(/\s/g, '').length;

    // Save submission to DB
    db.createSubmission({
      id: uuid(),
      user_id: req.user.id,
      challenge_id: challengeId,
      room_id: 'practice',
      code,
      language,
      char_count: charCount,
      passed: allPassed
    });

    res.json({
      allPassed,
      results,
      charCount
    });
  } catch (err) {
    console.error('Practice submission error:', err);
    res.status(500).json({ error: 'Code execution failed' });
  }
});

// Run practice code against examples only (no save)
router.post('/run', authenticate, async (req, res) => {
  const { code, language, challengeId } = req.body;

  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  try {
    const exampleTests = challenge.examples.map(e => ({
      input: e.input,
      expected: e.output
    }));

    const { allPassed, results } = await validateSolution(code, language, exampleTests);
    const charCount = code.replace(/\s/g, '').length;

    res.json({ allPassed, results, charCount });
  } catch (err) {
    res.status(500).json({ error: 'Code execution failed' });
  }
});

export default router;
