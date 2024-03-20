const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.postId) filter = { post: req.params.postId };

  const features = new APIFeatures(Post.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;
  // console.log(features.query);

  if (!posts) {
    return next(new AppError('Posts unable to fetch', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError(`Post with ID: ${postId} does not exist`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByIdAndUpdate(postId, req.body, {
    runValidators: true,
    new: true,
  });

  if (!post) {
    return next(new AppError(`Post with ID: ${postId} does not exist`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    return next(new AppError(`Post with ID: ${postId} does not exist`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
