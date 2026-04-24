import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const tournamentSchema = new mongoose.Schema({
  _id: { type: String, default: uuid },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['upcoming', 'in-progress', 'completed'], default: 'upcoming' },
  host_id: { type: String, required: true },
  host_name: { type: String },
  max_players: { type: Number, default: 16 },
  round_time: { type: Number, default: 300 },
  num_rounds: { type: Number, default: 3 },
  start_date: { type: Date },
  players: [{ type: Object }],
  rounds: [{ type: Object }],
  current_round: { type: Number, default: 0 },
  standings: [{ type: Object }],
  elo_pool: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

tournamentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Tournament = mongoose.model('Tournament', tournamentSchema);
