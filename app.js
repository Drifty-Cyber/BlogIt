const express = require('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

// EXPORT APP
module.exports = app;
