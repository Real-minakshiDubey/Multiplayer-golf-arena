import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { analyzeCodeWithSensei } from '../services/aiService.js';

const router = Router();

router.post('/analyze', authenticate, async (req, res) => {
  try {
    const { challenge, userCode, error, language } = req.body;

    if (!challenge || !userCode || !language) {
      return res.status(400).json({ error: "Missing required fields for analysis." });
    }

    const analysis = await analyzeCodeWithSensei({
      challenge,
      userCode,
      error,
      language
    });

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
