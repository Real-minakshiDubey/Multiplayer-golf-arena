import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const submissionSchema = new mongoose.Schema({
  _id: { type: String, default: uuid },
  user_id: { type: String, required: true },
  challenge_id: { type: String, required: true },
  room_id: { type: String },
  code: { type: String, required: true },
  language: { type: String, required: true },
  char_count: { type: Number },
  passed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

submissionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Submission = mongoose.model('Submission', submissionSchema);
