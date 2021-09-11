const asyncHandler = require('express-async-handler');
const { User } = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const config = require('../config/key');

// @desc      Register user
// @route     POST auth/register
// @access    Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send('유저가 존재합니다. !!');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send('유저 정보가 정확하지 않습니다.');
  }
});

// @desc      Login user
// @route     POST auth/register
// @access    Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send('로그인 정보가 정확하지 않습니다.!!');
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + config.jwtCookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = ture;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// @desc      Get current logged in user
// @route     Get auth/me
// @access    Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    return res.status(404).send('유저를 찾을 수 없습니다 !!');
  }
});

module.exports = { registerUser, login, getUserProfile };
