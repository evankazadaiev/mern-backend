const { check, validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    check('email', 'Email is not correct').normalizeEmail().isEmail();
    check('password', 'Min password length is 6 chars')
      .isLength({ min: 6 })
      .exists();
  
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Sign up data is not correct'
      })
    }
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'User is not authorized' });
  }
};
