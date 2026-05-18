const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const userId = req.userData?.userId || 'anonymous';
  const method = req.method;
  const url = req.url;

  console.log(`[${timestamp}] ${method} ${url} - User: ${userId}`);

  // Log response
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode >= 400) {
      console.error(`[${timestamp}] ERROR ${res.statusCode} - User: ${userId} - ${JSON.stringify(data)}`);
    }
    return originalJson(data);
  };

  next();
};

module.exports = logger;