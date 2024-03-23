const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// SignUp Route
router.route('/signup').post(authController.signup);

module.exports = router;
