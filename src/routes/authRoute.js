const { Router } = require('express');
const authRouter = Router();

const { register } = require('../controllers/auth');

authRouter.post('/register', register);

module.exports = { authRouter };
