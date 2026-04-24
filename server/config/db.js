import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Submission } from '../models/Submission.js';
import { Room } from '../models/Room.js';
import { Match } from '../models/Match.js';
import { Tournament } from '../models/Tournament.js';

export const db = {
  // ── USERS ──
  async findUserByEmail(email) {
    return await User.findOne({ email });
  },

  async findUserById(id) {
    return await User.findById(id);
  },

  async findUserByUsername(username) {
    return await User.findOne({ username });
  },

  async findUserByUsernameOrEmail(username, email) {
    return await User.findOne({ $or: [{ username }, { email }] });
  },

  async createUser(user) {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
  },

  async updateUser(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  },

  async incrementUserField(id, field, amount = 1) {
    return await User.findByIdAndUpdate(id, { $inc: { [field]: amount } });
  },

  async getLeaderboard(limit = 50) {
    return await User.find({}, '-password')
      .sort({ elo: -1 })
      .limit(limit);
  },

  // ── SUBMISSIONS ──
  async createSubmission(submission) {
    const newSub = new Submission(submission);
    await newSub.save();
    return newSub;
  },

  async getSubmissionsByUser(userId) {
    return await Submission.find({ user_id: userId });
  },

  async getBestSubmission(userId, challengeId) {
    return await Submission.findOne({ user_id: userId, challenge_id: challengeId, passed: true })
      .sort({ char_count: 1 });
  },

  async getSolvedChallengeIds(userId) {
    const solved = await Submission.find({ user_id: userId, passed: true }).select('challenge_id');
    return [...new Set(solved.map(s => s.challenge_id))];
  },

  // ── ROOMS ──
  async createRoom(room) {
    const newRoom = new Room(room);
    await newRoom.save();
    return newRoom;
  },

  async getWaitingRooms() {
    return await Room.find({ status: 'waiting' });
  },

  async updateRoom(id, updates) {
    return await Room.findByIdAndUpdate(id, updates, { new: true });
  },

  // ── MATCHES ──
  async createMatch(match) {
    const newMatch = new Match(match);
    await newMatch.save();
    return newMatch;
  },

  async getMatches(limit = 20) {
    return await Match.find()
      .sort({ created_at: -1 })
      .limit(limit);
  },

  async getMatchById(id) {
    return await Match.findById(id);
  },

  // ── TOURNAMENTS ──
  async createTournament(tournament) {
    const newTournament = new Tournament(tournament);
    await newTournament.save();
    return newTournament;
  },

  async getTournaments() {
    return await Tournament.find().sort({ created_at: -1 });
  },

  async getTournamentById(id) {
    return await Tournament.findById(id);
  },

  async updateTournament(id, updates) {
    return await Tournament.findByIdAndUpdate(id, updates, { new: true });
  }
};

export async function initDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('⚠️ MONGO_URI is missing in .env. Falling back to local MongoDB.');
    }
    const connectionString = uri || 'mongodb://localhost:27017/golf-arena';
    
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB Database');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Exit process with failure
  }
}