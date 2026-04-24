import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const matchSchema = new mongoose.Schema({
  _id: { type: String, default: uuid },
  room_code: { type: String, required: true },
  room_name: { type: String, required: true },
  challenge: { type: Object, required: true },
  players: [{ type: Object }], // array of player objects (id, username, avatar)
  leaderboard: [{ type: Object }], // array of leaderboard entry objects
  solutions: { type: Map, of: Object }, // map of user_id to solution objects (code, language, charCount)
  duration: { type: Number },
  winner: { type: Object },
  created_at: { type: Date, default: Date.now }
});

matchSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Match = mongoose.model('Match', matchSchema);
