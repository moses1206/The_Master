const { Router } = require('express');
const authRouter = Router();

const {
  login,
  registerUser,
  getUserProfile,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

authRouter.route('/register').post(registerUser);
authRouter.route('/login').post(login);
authRouter.route('/profile').get(protect, getUserProfile);

module.exports = { authRouter };
