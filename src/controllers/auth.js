const asyncHandler = require('../middleware/async');
const { User } = require('../models/User');
const config = require('../config/key');

// @desc      Register user
// @route     POST auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  //   Create User
  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST auth/register
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Email & Password
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: '이메일과 패스워드를 넣어주세요 !!' });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ message: '유저가 존재하지 않습니다.!' });
  }

  // Check if password matches

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ message: '패스워드가 일치하지 않습니다. !!' });
  }

  sendTokenResponse(user, 200, res);
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
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
