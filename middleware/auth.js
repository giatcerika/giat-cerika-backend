const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader); // Debug log

  if (!authHeader) {
    console.log('No auth header present'); // Debug log
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token.substring(0, 10) + '...'); // Debug log - only show first 10 chars
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token payload:', decoded); // Debug log
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err); // Debug log
    res.status(401).json({ message: 'Token is not valid' });
  }
};