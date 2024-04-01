const passport = require('passport');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const createSendToken = require('../utils/createSendToken');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // SEND WELCOME EMAIL BASED ON ENVIRONMENT
  if (process.env.NODE_ENV === 'production') {
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendGmail(
      'welcome',
      'Welcome to the BlogIt Family'
    );
  } else if (process.env.NODE_ENV === 'development') {
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    // console.log('Development Mode');
  }

  //   Create JWT and return as cookie to client
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide a username and password', 400));
  }

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password'), 401);
  }

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res
    .status(200)
    .json({ status: 'success', message: 'Logged out successfully' });
};

exports.loginGoogle = catchAsync(async (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] });
});
