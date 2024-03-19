const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {});

exports.createPost = catchAsync(async (req, res, next) => {});

exports.updatePost = catchAsync(async (req, res, next) => {});

exports.deletePost = catchAsync(async (req, res, next) => {});
