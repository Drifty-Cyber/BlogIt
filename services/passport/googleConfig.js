const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dotenv = require('dotenv');
const User = require('../../models/userModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/google/callback',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    },

    async function (request, accessToken, refreshToken, profile, done) {
      try {
        // Check if user with the provided email exists in the database
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          // If user doesn't exist, create a new account
          user = new User({
            email: profile.email,
            username: profile.given_name, // Use first name as username
            // You can add more fields here as needed
          });
          await user.save();
        }

        // Log the user in
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
