const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUSers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) return next(new AppError('Users could not be fetched', 404));

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {});
