const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const userId = req.userData?.userId || 'anonymous';

  console.error(`[${timestamp}] UNHANDLED ERROR - User: ${userId}`, err);

  // LLM timeout error
  if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
    return res.status(504).json({
      error: 'Request timeout',
      message: 'The AI took too long to respond. Please try again.',
      code: 'TIMEOUT'
    });
  }

  // Rate limit / quota exceeded
  if (err.status === 429 || err.message?.includes('quota') || err.message?.includes('rate limit')) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'AI service is temporarily unavailable due to high usage. Please try again in a moment.',
      code: 'QUOTA_EXCEEDED'
    });
  }

  // Authentication error
  if (err.status === 401 || err.message?.includes('authentication')) {
    return res.status(401).json({
      error: 'Authentication error',
      message: 'Invalid API credentials. Please contact support.',
      code: 'AUTH_ERROR'
    });
  }

  // Default server error
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong. Please try again.',
    code: 'SERVER_ERROR'
  });
};

module.exports = errorHandler;