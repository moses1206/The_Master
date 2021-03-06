const jwt = require('jsonwebtoken');
const config = require('../config/key');
const { User } = require('../models/User');
const asyncHandler = require('express-async-handler');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);

      req.user = await User.findById(decoded.id);

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send('인증에 실패하였습니다.!!');
    }
  }
  if (!token) {
    return res.status(400).send('토큰이 필요합니다.!!');
  }
});

module.exports = { protect };
