const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const postsRouter = require('./routes/postsRoutes');
const userRouter = require('./routes/userRoutes');

// Create App Instance
const app = express();

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

// Routes
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/users', userRouter);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
