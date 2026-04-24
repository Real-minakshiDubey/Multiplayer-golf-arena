import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  category: { type: String },
  inputFormat: { type: String },
  outputFormat: { type: String },
  examples: [
    {
      input: { type: String },
      output: { type: String }
    }
  ],
  testCases: [
    {
      input: { type: String },
      expected: { type: String }
    }
  ],
  created_by: { type: String }, // User ID who created it
  created_at: { type: Date, default: Date.now }
});

export const Challenge = mongoose.model('Challenge', challengeSchema);
