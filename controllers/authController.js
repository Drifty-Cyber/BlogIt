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

  if (process.env.NODE_ENV === 'production') {
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendGmail(
      'welcome',
      'Welcome to the BlogIt Family'
    );
  } else if (process.env.NODE_ENV === 'development') {
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    console.log('Development Mode');
  }

  //   Create JWT and return as cookie to client
  createSendToken(newUser, 201, req, res);
});
