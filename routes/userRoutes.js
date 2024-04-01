const passport = require('passport');
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// SignUp Route
router.route('/signup').post(authController.signup);

// Google Signup/login
router
  .route('/signup/google')
  .get(passport.authenticate('google', { scope: ['email', 'profile'] }));

module.exports = router;
