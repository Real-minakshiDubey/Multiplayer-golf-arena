import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { db } from '../config/db.js';

const router = Router();

const AVATARS = ['🏌️', '⛳', '🎯', '🚀', '🔥', '💎', '🎮', '👾', '🦊', '🐉'];

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = db.findUserByUsernameOrEmail(username, email);
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuid();
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

    const user = db.createUser({
      id,
      username,
      email,
      password: hashedPassword,
      avatar
    });

    const token = jwt.sign(
      { id, username, avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        elo: user.elo
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        elo: user.elo,
        games_played: user.games_played,
        games_won: user.games_won
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;