// Rough token estimation (1 token ≈ 4 characters)
const estimateTokens = (text) => {
  return Math.ceil(text.length / 4);
};

// Estimate tokens for entire message history
const estimateHistoryTokens = (messages) => {
  return messages.reduce((total, msg) => {
    return total + estimateTokens(msg.content);
  }, 0);
};

// Trim history to stay within token limit (80% of model limit)
const trimHistory = (messages, maxTokens = 80000) => {
  let totalTokens = estimateHistoryTokens(messages);

  while (totalTokens > maxTokens && messages.length > 1) {
    // Remove oldest message
    messages.shift();
    totalTokens = estimateHistoryTokens(messages);
  }

  return messages;
};

module.exports = { estimateTokens, estimateHistoryTokens, trimHistory };