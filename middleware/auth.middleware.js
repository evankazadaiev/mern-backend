const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    const chunks = req.headers.authorization.split(' ');
    const token = chunks[chunks.length - 1];

    if(!token) {
      return res.status(401).json({ message: 'User is not authorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ status: 401, message: 'User is not authorized' });
  }
};
