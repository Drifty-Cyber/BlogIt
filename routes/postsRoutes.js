const express = require('express');
const { getAllPosts, createPost } = require('../controllers/postsController');

const router = express.Router();

// Routes
router.route('/').get(getAllPosts).post(createPost);

module.exports = router;
