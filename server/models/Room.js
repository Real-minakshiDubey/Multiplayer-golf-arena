import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const roomSchema = new mongoose.Schema({
  _id: { type: String, default: uuid },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  host_id: { type: String, required: true },
  max_players: { type: Number, default: 2 },
  round_time: { type: Number, default: 300 },
  challenge_id: { type: String },
  status: { type: String, enum: ['waiting', 'playing', 'completed'], default: 'waiting' },
  created_at: { type: Date, default: Date.now }
});

roomSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Room = mongoose.model('Room', roomSchema);
