const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sessionId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['chat', 'review', 'explain'], default: 'chat' },
  language: { type: String, default: 'unknown' },
  title: { type: String, default: 'Untitled Session' },
  preview: { type: String, default: '' },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto delete oldest sessions when more than 50 per user
sessionSchema.statics.enforceLimit = async function(userId) {
  const count = await this.countDocuments({ userId });
  if (count > 50) {
    const oldest = await this.find({ userId })
      .sort({ createdAt: 1 })
      .limit(count - 50);
    const ids = oldest.map(s => s._id);
    await this.deleteMany({ _id: { $in: ids } });
  }
};

module.exports = mongoose.model('Session', sessionSchema);