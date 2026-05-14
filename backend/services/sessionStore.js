// In-memory session store
const sessions = new Map();

// Max messages per session before trimming
const MAX_MESSAGES = 20;
const TOKEN_LIMIT = 80000; // 80% of 100k token limit

// Get session history
const getSession = (sessionId) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
};

// Add message to session
const addMessage = (sessionId, role, content) => {
  const history = getSession(sessionId);
  history.push({ role, content });

  // Trim if too many messages
  if (history.length > MAX_MESSAGES) {
    // Keep system context, remove oldest messages
    history.splice(0, history.length - MAX_MESSAGES);
  }

  sessions.set(sessionId, history);
  return history;
};

// Clear session
const clearSession = (sessionId) => {
  sessions.set(sessionId, []);
};

// Get all sessions (for debugging)
const getSessionCount = () => sessions.size;

module.exports = { getSession, addMessage, clearSession, getSessionCount };