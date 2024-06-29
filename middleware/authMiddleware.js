// authMiddleware.js

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual JWT secret
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
}

module.exports = authMiddleware;
