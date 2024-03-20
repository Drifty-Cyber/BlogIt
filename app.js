const express = require('express');
const morgan = require('morgan');
const postsRouter = require('./routes/postsRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// EXPRESS MIDDLEWARE - Parse body data
app.use(express.json({ limit: '10kb' }));

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

// Routes
app.use('/api/v1/posts', postsRouter);

// EXPORT APP
module.exports = app;
