// corsMiddleware.js
module.exports = function corsMiddleware(req, res, next) {
  const origin = req.headers.origin || '*';

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Vary', 'Origin');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};
