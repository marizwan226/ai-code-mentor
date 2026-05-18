const rateLimit = require('express-rate-limit');

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max 20 requests per minute
  message: {
    error: 'Too many requests',
    message: 'You have exceeded 20 requests per minute. Please wait before trying again.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 auth requests per 15 minutes
  message: {
    error: 'Too many auth attempts',
    message: 'Too many login attempts. Please try again in 15 minutes.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { chatRateLimiter, authRateLimiter };