const Session = require('../models/Session');

// Save or update a session
exports.saveSession = async (req, res) => {
  try {
    const { sessionId, type, language, title, preview, messages } = req.body;
    const userId = req.userData?.userId || 'anonymous';

    let session = await Session.findOne({ sessionId });

    if (session) {
      session.messages = messages || session.messages;
      session.language = language || session.language;
      session.title = title || session.title;
      session.preview = preview || session.preview;
      session.updatedAt = new Date();
      await session.save();
    } else {
      session = await Session.create({
        userId,
        sessionId,
        type: type || 'chat',
        language: language || 'unknown',
        title: title || 'Untitled Session',
        preview: preview || '',
        messages: messages || []
      });
      await Session.enforceLimit(userId);
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save session', error: error.message });
  }
};

// Get all sessions for a user
exports.getSessions = async (req, res) => {
  try {
    const userId = req.userData?.userId || 'anonymous';
    const sessions = await Session.find({ userId })
      .sort({ updatedAt: -1 })
      .select('-messages')
      .limit(50);

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get sessions', error: error.message });
  }
};

// Get single session with full messages
exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userData?.userId || 'anonymous';

    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get session', error: error.message });
  }
};

// Delete a session
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userData?.userId || 'anonymous';

    await Session.findOneAndDelete({ sessionId, userId });
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete session', error: error.message });
  }
};