import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');
const DATA_DIR = path.join(__dirname, '..', 'data');

// Default empty database
const DEFAULT_DB = {
  users: [],
  submissions: [],
  rooms: [],
  matches: [],
  tournaments: []
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDB() {
  ensureDataDir();
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
      return { ...DEFAULT_DB };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('DB read error, resetting:', err.message);
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    return { ...DEFAULT_DB };
  }
}

function writeDB(data) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── Query helpers (mimic simple SQL) ───

export const db = {
  // ── USERS ──
  findUserByEmail(email) {
    const data = readDB();
    return data.users.find(u => u.email === email) || null;
  },

  findUserById(id) {
    const data = readDB();
    return data.users.find(u => u.id === id) || null;
  },

  findUserByUsername(username) {
    const data = readDB();
    return data.users.find(u => u.username === username) || null;
  },

  findUserByUsernameOrEmail(username, email) {
    const data = readDB();
    return data.users.find(u => u.username === username || u.email === email) || null;
  },

  createUser(user) {
    const data = readDB();
    const newUser = {
      elo: 1000,
      games_played: 0,
      games_won: 0,
      created_at: new Date().toISOString(),
      ...user
    };
    data.users.push(newUser);
    writeDB(data);
    return newUser;
  },

  updateUser(id, updates) {
    const data = readDB();
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    data.users[index] = { ...data.users[index], ...updates };
    writeDB(data);
    return data.users[index];
  },

  incrementUserField(id, field, amount = 1) {
    const data = readDB();
    const user = data.users.find(u => u.id === id);
    if (!user) return;
    user[field] = (user[field] || 0) + amount;
    writeDB(data);
  },

  getLeaderboard(limit = 50) {
    const data = readDB();
    return data.users
      .map(({ password, ...rest }) => rest)
      .sort((a, b) => b.elo - a.elo)
      .slice(0, limit);
  },

  // ── SUBMISSIONS ──
  createSubmission(submission) {
    const data = readDB();
    const newSub = {
      created_at: new Date().toISOString(),
      ...submission
    };
    data.submissions.push(newSub);
    writeDB(data);
    return newSub;
  },

  getSubmissionsByUser(userId) {
    const data = readDB();
    return data.submissions.filter(s => s.user_id === userId);
  },

  getBestSubmission(userId, challengeId) {
    const data = readDB();
    const passed = data.submissions.filter(
      s => s.user_id === userId && s.challenge_id === challengeId && s.passed
    );
    if (passed.length === 0) return null;
    return passed.reduce((a, b) => a.char_count < b.char_count ? a : b);
  },

  getSolvedChallengeIds(userId) {
    const data = readDB();
    const solved = data.submissions.filter(s => s.user_id === userId && s.passed);
    return [...new Set(solved.map(s => s.challenge_id))];
  },

  // ── ROOMS ──
  createRoom(room) {
    const data = readDB();
    const newRoom = {
      status: 'waiting',
      created_at: new Date().toISOString(),
      ...room
    };
    data.rooms.push(newRoom);
    writeDB(data);
    return newRoom;
  },

  getWaitingRooms() {
    const data = readDB();
    return data.rooms.filter(r => r.status === 'waiting');
  },

  updateRoom(id, updates) {
    const data = readDB();
    const index = data.rooms.findIndex(r => r.id === id);
    if (index === -1) return null;
    data.rooms[index] = { ...data.rooms[index], ...updates };
    writeDB(data);
    return data.rooms[index];
  },

  // ── MATCHES ──
  createMatch(match) {
    const data = readDB();
    const newMatch = {
      created_at: new Date().toISOString(),
      ...match
    };
    data.matches.push(newMatch);
    writeDB(data);
    return newMatch;
  },

  getMatches(limit = 20) {
    const data = readDB();
    return data.matches
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },

  getMatchById(id) {
    const data = readDB();
    return data.matches.find(m => m.id === id) || null;
  },

  // ── TOURNAMENTS ──
  createTournament(tournament) {
    const data = readDB();
    const newTournament = {
      created_at: new Date().toISOString(),
      ...tournament
    };
    data.tournaments.push(newTournament);
    writeDB(data);
    return newTournament;
  },

  getTournaments() {
    const data = readDB();
    return data.tournaments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getTournamentById(id) {
    const data = readDB();
    return data.tournaments.find(t => t.id === id) || null;
  },

  updateTournament(id, updates) {
    const data = readDB();
    const index = data.tournaments.findIndex(t => t.id === id);
    if (index === -1) return null;
    data.tournaments[index] = { ...data.tournaments[index], ...updates };
    writeDB(data);
    return data.tournaments[index];
  }
};

export function initDB() {
  ensureDataDir();
  readDB(); // Creates file if not exists
  console.log('✅ JSON Database initialized at', DB_PATH);
}