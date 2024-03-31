const passport = require('passport');
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// SignUp Route
router.route('/signup').post(authController.signup);

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
