const passport = require('passport');
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// SignUp Route
router.route('/signup').post(authController.signup);

// Auth Failure Route
router.route('/authFail').get(authController.authFailure);

// Google Signup/login
router
  .route('/signup/google')
  .get(passport.authenticate('google', { scope: ['email', 'profile'] }));

module.exports = router;
