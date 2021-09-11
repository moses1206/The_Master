const jwt = require('jsonwebtoken');
const config = require('../config/key');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '90d',
  });
};
module.exports = { generateToken };
