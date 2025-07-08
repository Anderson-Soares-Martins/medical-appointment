const jwt = require('jsonwebtoken');

// Middleware de autenticação e autorização por papel
function auth(roles = []) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Not authorized for this action' });
      }
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = auth; 