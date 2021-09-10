const { Router } = require('express');
const authRouter = Router();

const { register, login, getMe } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', getMe);

module.exports = { authRouter };
