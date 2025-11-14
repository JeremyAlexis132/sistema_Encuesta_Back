const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'x-api-key requerida' });

  try {
    const decoded = jwt.verify(apiKey, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'x-api-key inválida' });
  }
};

module.exports = { verifyToken };
