const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
// const debug = require('debug')('server:app');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRoutes');
const geodataRouter = require('./routes/geodataRoutes');
const floodGeodataRouter = require('./routes/floodGeodataRoutes');

const app = express();

app.use(cors())

// app.set('views', path.join(__dirname, 'dist'));
app.use(express.static(path.join(__dirname, 'dist/tophillgeohydro')));
// app.use(cors());
// 1) Global Middlewaes
// Set security HTTP header
app.use(helmet());

app.use(compression());

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});
// Cors===============================

// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '4000kb'
  })
// );
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['fileNumber']
  })
);

// ROUTES

// app.get('/home', (req, res) => {
//   res.status(200).render(path.join(__dirname, 'dist/index.html'));
// });
// app.get('/user/login', (req, res) => {
//   res.status(200).render(path.join(__dirname, 'dist/index.html'));
// });

app.use('/api/v1/user', userRouter);
app.use('/api/v1/geodata', geodataRouter);
app.use('/api/v1/floodGeodata', floodGeodataRouter);

app.get('/*', (req, res) => {
  res.status(200).render(path.join(__dirname, 'dist/tophillgeohydro/index'));
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
