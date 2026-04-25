import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { validateSolution } from '../services/codeExecutor.js';
import { v4 as uuid } from 'uuid';

const router = Router();

// Get current user's submissions
router.get('/me', authenticate, async (req, res) => {
  try {
    const submissions = await db.getSubmissionsByUser(req.user.id);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get solved challenge IDs for current user
router.get('/solved', authenticate, async (req, res) => {
  try {
    const solvedIds = await db.getSolvedChallengeIds(req.user.id);
    res.json(solvedIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get best submission for a specific challenge
router.get('/best/:challengeId', authenticate, async (req, res) => {
  try {
    const best = await db.getBestSubmission(req.user.id, req.params.challengeId);
    res.json(best);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit practice solution
router.post('/practice', authenticate, async (req, res) => {
  const { code, language, challengeId } = req.body;

  const challenge = await db.getChallengeById(challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  const challengeObj = challenge.toObject ? challenge.toObject() : challenge;

  try {
    const { allPassed, results } = await validateSolution(
      code, language, challengeObj.testCases
    );

    const charCount = code.replace(/\s/g, '').length;

    // Save submission to DB
    await db.createSubmission({
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

  const challenge = await db.getChallengeById(challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  const challengeObj = challenge.toObject ? challenge.toObject() : challenge;

  try {
    const exampleTests = challengeObj.examples.map(e => ({
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
