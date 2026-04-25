import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_JSON_PATH = path.join(__dirname, '../data/db.json');

let localJsonData = null;

function getJsonData() {
  if (localJsonData) return localJsonData;
  try {
    const data = fs.readFileSync(DB_JSON_PATH, 'utf-8');
    localJsonData = JSON.parse(data);
    return localJsonData;
  } catch (err) {
    console.error('❌ Failed to read db.json:', err.message);
    localJsonData = { users: [], submissions: [], rooms: [], matches: [], tournaments: [], challenges: [] };
    return localJsonData;
  }
}

function saveData() {
  const data = getJsonData();
  fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
}

export const db = {
  // ── USERS ──
  async findUserById(id) {
    const data = getJsonData();
    return data.users.find(u => u.id === id);
  },

  async findUserByUsername(username) {
    const data = getJsonData();
    return data.users.find(u => u.username === username);
  },

  async findUserByEmail(email) {
    const data = getJsonData();
    return data.users.find(u => u.email === email);
  },

  async findUserByUsernameOrEmail(username, email) {
    const data = getJsonData();
    return data.users.find(u => u.username === username || u.email === email);
  },

  async createUser(userData) {
    const data = getJsonData();
    const newUser = { 
      ...userData, 
      id: userData.id || uuid(), 
      elo: 1000, 
      games_played: 0, 
      games_won: 0, 
      role: userData.role || 'user',
      created_at: new Date().toISOString() 
    };
    data.users.push(newUser);
    saveData();
    return newUser;
  },

  async updateUser(id, updates) {
    const data = getJsonData();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updates };
      saveData();
      return data.users[index];
    }
    return null;
  },

  async incrementUserField(id, field, amount = 1) {
    const data = getJsonData();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      data.users[index][field] = (data.users[index][field] || 0) + amount;
      saveData();
      return data.users[index];
    }
    return null;
  },

  async recordEloChange(id, newElo) {
    const data = getJsonData();
    const user = data.users.find(u => u.id === id);
    if (user) {
      user.elo = newElo;
      user.elo_history = user.elo_history || [];
      user.elo_history.push({ elo: newElo, timestamp: new Date().toISOString() });
      saveData();
    }
    return user;
  },

  async getLeaderboard(limit = 50) {
    const data = getJsonData();
    return [...data.users]
      .filter(u => !u.role || u.role === 'user')
      .sort((a, b) => b.elo - a.elo)
      .slice(0, limit)
      .map(u => ({ ...u, id: u.id }));
  },

  // ── SUBMISSIONS ──
  async createSubmission(submissionData) {
    const data = getJsonData();
    data.submissions = data.submissions || [];
    const newSub = { 
      ...submissionData, 
      id: uuid(), 
      created_at: new Date().toISOString() 
    };
    data.submissions.push(newSub);
    saveData();
    return newSub;
  },

  async getSubmissionsByUser(userId) {
    const data = getJsonData();
    return data.submissions?.filter(s => s.user_id === userId) || [];
  },

  async getBestSubmission(userId, challengeId) {
    const data = getJsonData();
    const subs = data.submissions?.filter(s => s.user_id === userId && s.challenge_id === challengeId && s.passed) || [];
    return subs.sort((a, b) => a.char_count - b.char_count)[0] || null;
  },

  async getSolvedChallengeIds(userId) {
    const data = getJsonData();
    const solved = data.submissions?.filter(s => s.user_id === userId && s.passed) || [];
    return [...new Set(solved.map(s => s.challenge_id))];
  },

  // ── ROOMS ──
  async createRoom(room) {
    const data = getJsonData();
    data.rooms = data.rooms || [];
    const newRoom = {
      ...room,
      id: uuid(),
      status: room.status || 'waiting',
      created_at: new Date().toISOString()
    };
    data.rooms.push(newRoom);
    saveData();
    return newRoom;
  },

  async getWaitingRooms() {
    const data = getJsonData();
    return (data.rooms || []).filter(r => r.status === 'waiting');
  },

  async updateRoom(id, updates) {
    const data = getJsonData();
    const index = (data.rooms || []).findIndex(r => r.id === id);
    if (index !== -1) {
      data.rooms[index] = { ...data.rooms[index], ...updates };
      saveData();
      return data.rooms[index];
    }
    return null;
  },

  // ── MATCHES ──
  async createMatch(match) {
    const data = getJsonData();
    data.matches = data.matches || [];
    const newMatch = {
      ...match,
      id: uuid(),
      created_at: new Date().toISOString()
    };
    data.matches.push(newMatch);
    saveData();
    return newMatch;
  },

  async getMatches(limit = 20) {
    const data = getJsonData();
    return [...(data.matches || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },

  async getMatchById(id) {
    const data = getJsonData();
    return (data.matches || []).find(m => m.id === id);
  },

  // ── TOURNAMENTS ──
  async createTournament(tournament) {
    const data = getJsonData();
    data.tournaments = data.tournaments || [];
    const newTournament = {
      ...tournament,
      id: uuid(),
      created_at: new Date().toISOString()
    };
    data.tournaments.push(newTournament);
    saveData();
    return newTournament;
  },

  async getTournaments() {
    const data = getJsonData();
    return [...(data.tournaments || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getTournamentById(id) {
    const data = getJsonData();
    return (data.tournaments || []).find(t => t.id === id);
  },

  async updateTournament(id, updates) {
    const data = getJsonData();
    const index = (data.tournaments || []).findIndex(t => t.id === id);
    if (index !== -1) {
      data.tournaments[index] = { ...data.tournaments[index], ...updates };
      saveData();
      return data.tournaments[index];
    }
    return null;
  },

  // ── CHALLENGES ──
  async getChallenges() {
    return getJsonData().challenges || [];
  },

  async getChallengeById(id) {
    const data = getJsonData();
    return data.challenges?.find(c => c.id === id);
  },

  async createChallenge(challengeData) {
    const data = getJsonData();
    data.challenges = data.challenges || [];
    data.challenges.push(challengeData);
    saveData();
    return challengeData;
  },

  async deleteChallenge(id) {
    const data = getJsonData();
    const index = data.challenges?.findIndex(c => c.id === id);
    if (index === -1 || index === undefined) return null;
    const deleted = data.challenges.splice(index, 1)[0];
    saveData();
    return deleted;
  }
};

export async function initDB() {
  // Load JSON data on startup
  const data = getJsonData();
  console.log(`📦 Local JSON Database loaded — ${data.users?.length || 0} users, ${data.challenges?.length || 0} challenges, ${data.matches?.length || 0} matches`);
}