const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const globalErrorHandler = require('./controllers/errorController');
const postsRouter = require('./routes/postsRoutes');
const userRouter = require('./routes/userRoutes');

// Setup Auth for OAuth
require('./services/passport/googleConfig');

// Create App Instance
const app = express();

// Passport Initialization
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// SETTING UP PUG
// app.set('view engine', 'pug');

// SETTING UP THE VIEWS FOLDER FOR MVC
// app.set('views', path.join(__dirname, 'views'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// SETUP MORGAN LOGGER
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// STATIC FILES RENDERING
app.use(express.static(path.join(__dirname, 'public')));

// EXPRESS MIDDLEWARE - Parse body data
app.use(express.json({ limit: '10kb' }));

// Parse form data
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);

// Parse cookies
app.use(cookieParser());

//CUSTOM MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Welcome',
  });
});

app.get('/google', (req, res, next) => {
  res.status(200).render('login');
});

app.get(
  '/signup/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/api/v1/posts',
    failureRedirect: '/users/authFail',
  })
);

// Routes
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/users', userRouter);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
