import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import Models
import { User } from './models/User.js';
import { Submission } from './models/Submission.js';
import { Room } from './models/Room.js';
import { Match } from './models/Match.js';
import { Tournament } from './models/Tournament.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'db.json');

async function migrateData() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI missing in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    if (!fs.existsSync(DB_PATH)) {
      console.log('No local db.json found. Nothing to migrate.');
      process.exit(0);
    }

    const rawData = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    console.log('Clearing existing MongoDB collections to prevent duplicates...');
    await Promise.all([
      User.deleteMany({}),
      Submission.deleteMany({}),
      Room.deleteMany({}),
      Match.deleteMany({}),
      Tournament.deleteMany({})
    ]);

    console.log(`Migrating ${data.users?.length || 0} users...`);
    if (data.users && data.users.length > 0) {
      await User.insertMany(data.users.map(u => ({ ...u, _id: u.id })));
    }

    console.log(`Migrating ${data.submissions?.length || 0} submissions...`);
    if (data.submissions && data.submissions.length > 0) {
      await Submission.insertMany(data.submissions.map(s => ({ ...s, _id: s.id })));
    }

    console.log(`Migrating ${data.rooms?.length || 0} rooms...`);
    if (data.rooms && data.rooms.length > 0) {
      await Room.insertMany(data.rooms.map(r => ({ ...r, _id: r.id })));
    }

    console.log(`Migrating ${data.matches?.length || 0} matches...`);
    if (data.matches && data.matches.length > 0) {
      await Match.insertMany(data.matches.map(m => ({ ...m, _id: m.id })));
    }

    console.log(`Migrating ${data.tournaments?.length || 0} tournaments...`);
    if (data.tournaments && data.tournaments.length > 0) {
      await Tournament.insertMany(data.tournaments.map(t => ({ ...t, _id: t.id })));
    }

    console.log('🎉 Migration Complete! Your local data is now in the Cloud.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrateData();
